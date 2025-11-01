export const weatherController = {
  // Map OpenWeatherMap icon codes to more descriptive weather codes
  getWeatherCode(iconCode, mainWeather) {
    const codeMap = {
      "01d": 800, "01n": 800, // Clear
      "02d": 801, "02n": 801, // Few clouds
      "03d": 802, "03n": 802, // Scattered clouds
      "04d": 803, "04n": 803, // Broken clouds
      "09d": 520, "09n": 520, // Shower rain
      "10d": 500, "10n": 500, // Rain
      "11d": 211, "11n": 211, // Thunderstorm
      "13d": 600, "13n": 600, // Snow
      "50d": 741, "50n": 741, // Mist/Fog
    };
    return codeMap[iconCode] || 800;
  },

  async getCurrentWeather(city, country = "") {
    try {
      const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

      if (!OPENWEATHER_API_KEY) {
        throw new Error("Weather API key not configured");
      }

      const locationQuery = country ? `${city},${country}` : city;
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        locationQuery
      )}&appid=${OPENWEATHER_API_KEY}&units=metric`;

      const response = await fetch(currentWeatherUrl);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City or country not recognized. Please edit your profile information with a valid location.");
        }
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();

      // Get UV Index (requires separate API call with coordinates)
      let uvIndex = 0;
      try {
        const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${OPENWEATHER_API_KEY}`;
        const uvResponse = await fetch(uvUrl);
        if (uvResponse.ok) {
          const uvData = await uvResponse.json();
          uvIndex = Math.round(uvData.value || 0);
        }
      } catch (error) {
        console.error("Error fetching UV index:", error);
      }

      return {
        success: true,
        data: {
          location: `${data.name}, ${data.sys.country}`,
          temperature: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          condition: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          windDirection: data.wind.deg,
          visibility: (data.visibility / 1000).toFixed(1), // Convert to km
          uvIndex: uvIndex,
          icon: data.weather[0].icon,
          weatherCode: this.getWeatherCode(data.weather[0].icon, data.weather[0].main),
          pressure: data.main.pressure,
          cloudiness: data.clouds.all,
          sunrise: data.sys.sunrise,
          sunset: data.sys.sunset,
          coordinates: {
            lat: data.coord.lat,
            lon: data.coord.lon,
          },
        },
      };
    } catch (error) {
      console.error("Error fetching current weather:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  },

  async getForecast(city, country = "") {
    try {
      const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

      if (!OPENWEATHER_API_KEY) {
        throw new Error("Weather API key not configured");
      }

      const locationQuery = country ? `${city},${country}` : city;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
        locationQuery
      )}&appid=${OPENWEATHER_API_KEY}&units=metric`;

      const response = await fetch(forecastUrl);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City or country not recognized. Please edit your profile information with a valid location.");
        }
        throw new Error(`Forecast API error: ${response.status}`);
      }

      const data = await response.json();

      // Group forecasts by day and calculate daily high/low
      const dailyForecasts = {};
      
      data.list.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toISOString().split('T')[0];
        
        if (!dailyForecasts[dateKey]) {
          dailyForecasts[dateKey] = {
            date: dateKey,
            temps: [],
            conditions: [],
            icons: [],
            humidity: [],
            windSpeed: [],
            precipitation: 0,
          };
        }
        
        dailyForecasts[dateKey].temps.push(item.main.temp);
        dailyForecasts[dateKey].conditions.push(item.weather[0].description);
        dailyForecasts[dateKey].icons.push(item.weather[0].icon);
        dailyForecasts[dateKey].humidity.push(item.main.humidity);
        dailyForecasts[dateKey].windSpeed.push(item.wind.speed * 3.6);
        
        // Calculate precipitation probability
        if (item.pop) {
          dailyForecasts[dateKey].precipitation = Math.max(
            dailyForecasts[dateKey].precipitation,
            Math.round(item.pop * 100)
          );
        }
      });

      // Convert to array and take first 5 days
      const forecast = Object.values(dailyForecasts)
        .slice(0, 5)
        .map((day, index) => {
          const avgTemp = day.temps.reduce((a, b) => a + b, 0) / day.temps.length;
          const high = Math.round(Math.max(...day.temps));
          const low = Math.round(Math.min(...day.temps));
          
          // Get most common condition and icon
          const condition = day.conditions[Math.floor(day.conditions.length / 2)];
          const icon = day.icons[Math.floor(day.icons.length / 2)];
          
          return {
            day: index === 0
              ? "Today"
              : new Date(day.date).toLocaleDateString("en-US", {
                  weekday: "long",
                }),
            date: day.date,
            high: high,
            low: low,
            condition: condition,
            icon: icon,
            precipitation: day.precipitation,
            weatherCode: this.getWeatherCode(icon, condition),
            avgHumidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
            avgWindSpeed: Math.round(day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length),
          };
        });

      return {
        success: true,
        data: forecast,
      };
    } catch (error) {
      console.error("Error fetching forecast:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  },

  getFarmingTips(weatherCode, temperature, humidity, condition, forecast = []) {
    const tips = [];

    // Critical Temperature Alerts for Farming
    if (temperature > 38) {
      tips.push({
        title: "🔥 Extreme Heat Emergency",
        description:
          "Critical heat stress conditions. Harvest early morning only. Use shade nets (50-70% coverage) for vegetables. Apply anti-transpirant sprays to reduce water loss. Move livestock to cooled barns with fans. Emergency irrigation may be needed.",
        type: "warning",
        priority: 1,
      });
    } else if (temperature > 35) {
      tips.push({
        title: "☀️ Severe Heat Protection",
        description:
          "Provide shade cloth for tomatoes, peppers, and leafy greens. Water at 4-6 AM or after 7 PM to maximize absorption. Mulch depth should be 8-10 cm. Monitor for heat stress indicators: leaf curl, blossom drop, fruit sunscald.",
        type: "warning",
        priority: 1,
      });
      tips.push({
        title: "🐄 Livestock Heat Management",
        description:
          "Ensure 2x normal water supply. Add electrolytes to drinking water. Use misters or sprinklers in holding areas. Delay breeding activities. Provide salt blocks for mineral supplementation.",
        type: "warning",
        priority: 2,
      });
    } else if (temperature > 30) {
      tips.push({
        title: "🌡️ Hot Weather Crop Care",
        description:
          "Increase irrigation frequency by 30-40%. Apply organic mulch (straw, grass clippings). Consider temporary shade structures for sensitive crops. Delay transplanting to cooler evening hours. Monitor soil moisture at root depth (15-20 cm).",
        type: "info",
        priority: 2,
      });
    } else if (temperature < 0) {
      tips.push({
        title: "❄️ Severe Frost Emergency",
        description:
          "IMMEDIATE ACTION NEEDED: Use frost blankets, burlap, or plastic sheets before sunset. Run sprinklers to create ice shield on plants. Harvest all tender crops NOW. Drain irrigation systems. Bring potted plants indoors. Check livestock water every 2 hours.",
        type: "warning",
        priority: 1,
      });
    } else if (temperature < 5) {
      tips.push({
        title: "🧊 Frost Protection Critical",
        description:
          "Deploy row covers and cloches. Use smudge pots or heaters in orchards. Water soil before sunset (moist soil retains heat). Harvest frost-sensitive vegetables (tomatoes, cucumbers, beans). Insulate water lines and protect pumps.",
        type: "warning",
        priority: 1,
      });
    } else if (temperature < 10) {
      tips.push({
        title: "🌬️ Cold Weather Strategies",
        description:
          "Delay planting warm-season crops (corn, soybeans, cotton). Use cold frames for early vegetables. Apply mulch around perennials. Check greenhouse heating systems. Good time to plant cool-season crops: peas, lettuce, spinach, onions.",
        type: "warning",
        priority: 2,
      });
      tips.push({
        title: "🥬 Winter Crop Opportunities",
        description:
          "Perfect for cole crops (broccoli, cabbage, cauliflower), root vegetables (carrots, beets, turnips), and winter grains (wheat, rye, barley). Apply winter cover crops to prevent soil erosion and improve soil health.",
        type: "positive",
        priority: 3,
      });
    } else if (temperature >= 18 && temperature <= 28) {
      tips.push({
        title: "✅ Optimal Growing Conditions",
        description:
          "Ideal temperature range for most crops! Perfect for: transplanting seedlings, direct seeding vegetables, applying fertilizers, pest management activities, soil testing and amendments. Maximize field operations during these conditions.",
        type: "positive",
        priority: 3,
      });
    }

    // Advanced Humidity Management for Disease Prevention
    if (humidity > 90) {
      tips.push({
        title: "⚠️ Critical Disease Risk - Very High Humidity",
        description:
          "EXTREME fungal disease risk! Apply preventive copper-based fungicides. Increase plant spacing for air circulation. Remove lower leaves touching soil. Avoid overhead irrigation completely. Monitor for late blight (tomatoes/potatoes), powdery mildew, and rust diseases.",
        type: "warning",
        priority: 1,
      });
    } else if (humidity > 85) {
      tips.push({
        title: "🍄 High Fungal Disease Alert",
        description:
          "High risk of downy mildew, anthracnose, and bacterial leaf spot. Use drip irrigation only. Apply sulfur or neem oil preventively. Improve drainage in fields. Stake and prune plants for better airflow. Inspect crops daily for early disease signs.",
        type: "warning",
        priority: 1,
      });
      tips.push({
        title: "🔬 Disease Prevention Protocol",
        description:
          "Space plants 20-30% wider than usual. Remove and destroy infected plant material immediately. Apply biological fungicides (Bacillus subtilis). Avoid working in wet fields to prevent disease spread. Use clean, sanitized tools.",
        type: "warning",
        priority: 2,
      });
    } else if (humidity > 70) {
      tips.push({
        title: "💧 Moderate Humidity - Disease Watch",
        description:
          "Monitor for early blight, septoria leaf spot, and botrytis. Consider organic fungicides (copper, sulfur, neem oil). Ensure proper plant spacing (40-60 cm for tomatoes). Morning watering allows foliage to dry quickly.",
        type: "info",
        priority: 2,
      });
    } else if (humidity < 25) {
      tips.push({
        title: "🏜️ Severe Drought Stress Alert",
        description:
          "Critical moisture deficit! Implement emergency irrigation schedule (daily if possible). Apply 10-15 cm of organic mulch. Consider hydrogel soil amendments. Install windbreaks to reduce transpiration. Monitor for spider mites and thrips (thrive in dry conditions).",
        type: "warning",
        priority: 1,
      });
    } else if (humidity < 40) {
      tips.push({
        title: "🌵 Low Humidity Management",
        description:
          "Increase irrigation frequency by 20-30%. Apply thick mulch layer. Use windbreaks or shade cloth to reduce evapotranspiration. Mist greenhouse crops 2-3 times daily. Monitor soil moisture at 15 cm depth. Watch for leaf tip burn and wilting.",
        type: "info",
        priority: 2,
      });
    }

    // Weather Condition-Based Agricultural Advice
    const conditionLower = condition.toLowerCase();

    if (conditionLower.includes("rain") || conditionLower.includes("drizzle") || conditionLower.includes("shower")) {
      const isHeavy = conditionLower.includes("heavy") || conditionLower.includes("storm");
      
      if (isHeavy) {
        tips.push({
          title: "🌧️ Heavy Rain Protocol",
          description:
            "Check and clear drainage ditches immediately. Inspect for soil erosion and waterlogging. Support tall plants (corn, sunflowers). Cover harvested crops. Delay all fertilizer and pesticide applications. Risk of nutrient leaching in sandy soils.",
          type: "warning",
          priority: 1,
        });
      } else {
        tips.push({
          title: "☔ Rainy Weather Farming",
          description:
            "Postpone fertilizer applications for 24-48 hours. Ensure proper field drainage. Avoid field work on clay soils to prevent compaction. Good time for: equipment maintenance, record keeping, planning crop rotations, and indoor seed starting.",
          type: "info",
          priority: 2,
        });
      }
      
      tips.push({
        title: "💧 Rainwater Harvesting Opportunity",
        description:
          "Collect rainwater in barrels or tanks for future irrigation. Natural rainfall is nitrogen-rich and chemical-free. After rain, wait until soil is 50-60% dry before working (squeeze test: soil should crumble, not form a ball).",
        type: "positive",
        priority: 3,
      });
    } else if (conditionLower.includes("sunny") || conditionLower.includes("clear")) {
      tips.push({
        title: "☀️ Perfect Harvest Weather",
        description:
          "Excellent for: harvesting grain crops (moisture content ideal), hay making (cure in 2-3 days), seed drying, post-harvest processing. Apply pesticides early morning for best efficacy. Low disease pressure. Ideal for soil preparation and planting.",
        type: "positive",
        priority: 3,
      });
      tips.push({
        title: "🌾 Optimal Field Operations",
        description:
          "Best conditions for: plowing, disking, planting, cultivating between rows. Apply granular fertilizers (won't wash away). Scout fields for pest and disease. Excellent for farm tours and field inspections. Check irrigation systems.",
        type: "positive",
        priority: 3,
      });
    } else if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) {
      tips.push({
        title: "☁️ Cloudy Weather Benefits",
        description:
          "Perfect for transplanting (50% less transplant shock). Ideal for: grafting operations, applying foliar fertilizers (better absorption), pesticide application (slower evaporation). Reduced water stress on plants. Excellent for working livestock.",
        type: "positive",
        priority: 3,
      });
      tips.push({
        title: "🌱 Lower Evaporation Advantage",
        description:
          "Reduce irrigation by 30-40% today. Plants experience less heat stress. Good conditions for: pruning, thinning fruit, weeding (less physical strain). Soil moisture stays consistent. Beneficial for seed germination.",
        type: "positive",
        priority: 3,
      });
    } else if (conditionLower.includes("wind")) {
      tips.push({
        title: "💨 Windy Conditions Alert",
        description:
          "NO pesticide or fertilizer spraying (drift risk). Secure: plastic mulch, row covers, greenhouse panels, farm equipment. Support tall plants and young trees. Check irrigation systems for disruption. Delay drone operations. Wind speed >25 km/h: stay out of orchards (falling branch risk).",
        type: "warning",
        priority: 1,
      });
    }

    // Specific Weather Code Agricultural Impacts
    if (weatherCode >= 200 && weatherCode <= 233) {
      // Thunderstorms
      tips.push({
        title: "⛈️ Severe Storm Emergency Response",
        description:
          "URGENT: Move livestock to secure shelter. Secure all equipment and close greenhouse vents. Unplug electrical equipment. After storm: inspect for hail damage (bruised fruit, torn leaves), check for lodged crops, assess infrastructure damage, document losses for insurance.",
        type: "warning",
        priority: 1,
      });
      tips.push({
        title: "⚡ Lightning Safety Protocol",
        description:
          "STOP all field operations immediately. Avoid: metal equipment, tractors, open fields, tall trees, water sources. Wait 30 minutes after last thunder before resuming. Use downtime for: administrative tasks, maintenance planning, or inventory management.",
        type: "warning",
        priority: 1,
      });
    } else if (weatherCode >= 600 && weatherCode <= 623) {
      // Snow
      tips.push({
        title: "❄️ Snow Management for Farms",
        description:
          "Remove snow from greenhouse roofs (max load: 20-25 kg/m²). Ensure livestock have access to unfrozen water (use tank heaters). Increase feed rations by 20-30% for animals. Snow acts as natural insulation (good for winter wheat, garlic, perennials).",
        type: "warning",
        priority: 1,
      });
      tips.push({
        title: "🌨️ Winter Planning Activities",
        description:
          "Use indoor time productively: order seeds and supplies for spring, plan crop rotations, maintain equipment, review last season's records, attend online farming webinars, prepare tax documents, calibrate equipment.",
        type: "positive",
        priority: 3,
      });
    } else if (weatherCode >= 700 && weatherCode <= 781) {
      // Atmospheric conditions
      if (weatherCode === 721 || weatherCode === 741) {
        // Haze/Fog
        tips.push({
          title: "🌫️ Fog - Limited Visibility",
          description:
            "Delay tractor and machinery operations until visibility >100 meters. Fog provides free moisture for crops (reduces irrigation needs). Good for: barn work, animal care, equipment maintenance. Excellent germination conditions for direct-seeded crops.",
          type: "info",
          priority: 2,
        });
      } else if (weatherCode >= 731 && weatherCode <= 781) {
        // Dust/Sand storms
        tips.push({
          title: "🌪️ Dust Storm Protection",
          description:
            "Cover sensitive crops with tarps or sheets. Bring small animals indoors. Close greenhouse vents. Protect water sources from contamination. After storm: wash vegetable leaves, check air filters on equipment. Plant windbreak trees/shrubs to prevent future damage.",
          type: "warning",
          priority: 1,
        });
      }
    }

    // Analyze forecast trends for predictive farming advice
    if (forecast && forecast.length >= 3) {
      const upcomingRain = forecast.some(day => day.precipitation > 60);
      const upcomingHeat = forecast.some(day => day.high > 32);
      const upcomingCold = forecast.some(day => day.low < 5);

      if (upcomingRain && !conditionLower.includes("rain")) {
        tips.push({
          title: "🌧️ Rain Forecast - Prepare Now",
          description:
            "Heavy rain expected in next 3 days. Complete time-sensitive tasks: apply pre-emergent herbicides, fertilize fields, spray pesticides, harvest ripe crops, repair drainage systems, check field slopes for erosion risk, move equipment to dry storage.",
          type: "info",
          priority: 2,
        });
      }

      if (upcomingHeat && temperature < 30) {
        tips.push({
          title: "🔥 Heat Wave Coming",
          description:
            "Hot weather approaching. Prepare: increase mulch depth, check irrigation systems, install shade structures, apply anti-transpirant to transplants, harvest heat-sensitive crops early, ensure livestock cooling systems work, store extra water.",
          type: "info",
          priority: 2,
        });
      }

      if (upcomingCold && temperature > 10) {
        tips.push({
          title: "🥶 Cold Snap Warning",
          description:
            "Frost risk in coming days. Actions: harvest tender vegetables (tomatoes, peppers, cucumbers, eggplants), prepare frost protection materials, mulch around perennials, drain outdoor water systems, protect citrus trees, move cold-sensitive plants under cover.",
          type: "warning",
          priority: 1,
        });
      }
    }

    // Seasonal Farming Calendar
    const currentMonth = new Date().getMonth();

    if (currentMonth >= 2 && currentMonth <= 4) {
      // Spring (March-May)
      tips.push({
        title: "🌸 Spring Season Activities",
        description:
          "Prepare seedbeds (till when soil temperature >10°C). Start composting. Test soil pH and nutrients. Prune fruit trees before bud break. Plant: potatoes, peas, lettuce, onions, carrots. Service farm equipment (tractors, planters, sprayers). Order seeds and supplies early.",
        type: "positive",
        priority: 3,
      });
    } else if (currentMonth >= 5 && currentMonth <= 7) {
      // Summer (June-August)
      tips.push({
        title: "☀️ Summer Growing Season",
        description:
          "Monitor pests: aphids, caterpillars, beetles. Scout fields weekly. Implement IPM (Integrated Pest Management). Maintain consistent irrigation (1-2 inches/week). Practice crop rotation. Side-dress corn and tomatoes with nitrogen. Harvest continuously to encourage production.",
        type: "info",
        priority: 2,
      });
    } else if (currentMonth >= 8 && currentMonth <= 10) {
      // Fall (September-November)
      tips.push({
        title: "🍂 Harvest Season Focus",
        description:
          "Monitor crop maturity daily. Plan storage solutions (cure onions, dry beans). Process and preserve harvest. Plant cover crops immediately after harvest (prevents erosion, adds organic matter). Begin fall soil amendments. Order manure for spring application. Test grain moisture before storage.",
        type: "positive",
        priority: 3,
      });
    } else {
      // Winter (December-February)
      tips.push({
        title: "❄️ Winter Planning & Maintenance",
        description:
          "Review farm records and analyze profitability. Plan next year's crop rotation. Order seeds (10-15% more than needed). Service and repair equipment. Attend agricultural workshops. Apply for grants and certifications. Build/repair infrastructure during downtime. Maintain livestock shelters.",
        type: "info",
        priority: 3,
      });
    }

    // Advanced Soil & Water Conservation
    if (temperature > 25 || humidity < 60) {
      tips.push({
        title: "💧 Water Conservation Techniques",
        description:
          "Implement drip irrigation (60-70% water savings). Use soaker hoses for row crops. Mulch reduces evaporation by 50%. Practice deficit irrigation for established crops. Install rain sensors on irrigation controllers. Collect rainwater (1 inch on 1000 sq ft = 623 gallons). Monitor soil moisture with tensiometers.",
        type: "info",
        priority: 2,
      });
    }

    // Integrated Pest Management & Beneficial Insects
    if (temperature >= 15 && temperature <= 28 && humidity > 40 && humidity < 80) {
      tips.push({
        title: "🐝 Ideal for Pollinators & Beneficial Insects",
        description:
          "Peak activity for: bees, butterflies, ladybugs, lacewings, parasitic wasps. AVOID broad-spectrum pesticides (kills beneficials). Spray only if necessary, use targeted approaches. Plant pollinator-friendly flowers: sunflowers, zinnias, lavender. Maintain habitat strips along field edges.",
        type: "positive",
        priority: 3,
      });
    }

    // UV Index Specific Farming Advice (if available)
    if (weatherCode === 800 || weatherCode === 801) {
      tips.push({
        title: "🌞 Strong UV Protection Needed",
        description:
          "Farm workers: wear wide-brimmed hats, long sleeves, sunscreen (SPF 30+), UV-blocking sunglasses. Take breaks in shade every 2 hours. Risk of fruit sunscald: use shade cloth over tomatoes, peppers, melons. Apply kaolin clay spray as natural UV protectant for fruit.",
        type: "info",
        priority: 2,
      });
    }

    // Soil Health & Organic Matter Management
    if (currentMonth >= 9 || currentMonth <= 3) {
      tips.push({
        title: "🌱 Soil Health Improvement",
        description:
          "Apply compost (2-4 inches) to improve soil structure. Plant cover crops: clover (fixes nitrogen), rye (prevents erosion), radishes (break compaction). Test soil every 2-3 years. Add organic matter (increases water retention by 20-30%). Practice no-till farming to preserve soil microbiome.",
        type: "positive",
        priority: 3,
      });
    }

    // Emergency Preparedness & Risk Management
    if (weatherCode >= 200 && weatherCode <= 781 && weatherCode !== 800) {
      tips.push({
        title: "⚠️ Emergency Farm Preparedness",
        description:
          "Maintain emergency supplies: generator fuel, livestock feed (7-day supply), first aid kits, flashlights, battery-powered radio. Have backup water sources. Document all losses with photos for insurance. Keep emergency contact list: veterinarian, extension agent, insurance agent, equipment repair.",
        type: "info",
        priority: 2,
      });
    }

    // Sort by priority (1 = highest priority)
    tips.sort((a, b) => (a.priority || 3) - (b.priority || 3));

    // Ensure at least some tips are always provided
    if (tips.length === 0) {
      tips.push({
        title: "📋 Daily Farm Management Checklist",
        description:
          "Conduct morning and evening crop inspections. Check irrigation systems daily. Monitor livestock health (appetite, behavior, manure). Record daily weather, tasks completed, observations. Calibrate equipment regularly. Maintain detailed farm records for tax and planning purposes.",
        type: "info",
        priority: 3,
      });
      tips.push({
        title: "🌿 Sustainable Farming Practices",
        description:
          "Implement Integrated Pest Management (IPM). Use crop rotation (4-year cycle minimum). Maintain biodiversity with hedgerows and pollinator strips. Reduce chemical inputs gradually. Test soil regularly. Attend agricultural extension workshops. Join local farming cooperatives for knowledge sharing.",
        type: "positive",
        priority: 3,
      });
    }

    // Limit to maximum of 8 most relevant tips
    return tips.slice(0, 8);
  },

  async getWeatherData(city, country = "") {
    try {
      // Fetch current weather and forecast in parallel
      const [currentWeatherResult, forecastResult] = await Promise.all([
        this.getCurrentWeather(city, country),
        this.getForecast(city, country),
      ]);

      if (!currentWeatherResult.success) {
        return currentWeatherResult;
      }

      if (!forecastResult.success) {
        return forecastResult;
      }

      // Generate farming tips based on current weather and forecast
      const farmingTips = this.getFarmingTips(
        currentWeatherResult.data.weatherCode,
        currentWeatherResult.data.temperature,
        currentWeatherResult.data.humidity,
        currentWeatherResult.data.condition,
        forecastResult.data
      );

      return {
        success: true,
        data: {
          current: currentWeatherResult.data,
          forecast: forecastResult.data,
          farmingTips: farmingTips,
        },
      };
    } catch (error) {
      console.error("Error getting weather data:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch weather data",
      };
    }
  },
};
