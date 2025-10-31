"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function CreatePostArea({ 
  isDialogOpen, 
  setIsDialogOpen, 
  newPost, 
  setNewPost, 
  handleCreatePost, 
  predefinedFlairs,
  user,
  uploadingImages,
  handleImageUpload,
  removeImage
}) {

  return (
    <div className="mb-8">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="max-w-2xl mx-auto">
            <div 
              className="w-full p-6 border-2 border-dashed border-green-300 dark:border-green-600 rounded-xl hover:border-green-400 dark:hover:border-green-500 transition-all cursor-pointer bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-800/30 dark:hover:to-emerald-800/30"
              onClick={() => setIsDialogOpen(true)}
            >
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white group-hover:rotate-180 duration-300 ease-in-out transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Share your agricultural insights</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Click here to ask questions, share tips, or start discussions with fellow farmers
                </p>
              </div>
            </div>
          </div>
        </DialogTrigger>
        
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Create a New Post
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCreatePost} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold dark:text-gray-200">Title</Label>
              <input
                id="title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="What's your question or topic?"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-semibold dark:text-gray-200">Content</Label>
              <textarea
                id="content"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Describe your question, share your knowledge, or start a discussion..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all min-h-32 resize-y bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="flair" className="text-sm font-semibold dark:text-gray-200">Category (Optional)</Label>
              <select
                value={newPost.flair}
                onChange={(e) => setNewPost({ ...newPost, flair: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select a category</option>
                {predefinedFlairs.map((flair) => (
                  <option key={flair} value={flair}>
                    {flair}
                  </option>
                ))}
                <option value="custom">Custom Category</option>
              </select>
            </div>

            {newPost.flair === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="customFlair" className="text-sm font-semibold dark:text-gray-200">Custom Category</Label>
                <input
                  id="customFlair"
                  value={newPost.customFlair}
                  onChange={(e) => setNewPost({ ...newPost, customFlair: e.target.value })}
                  placeholder="Enter your custom category"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            )}

            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold dark:text-gray-200">Images (Optional - Max 5)</Label>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                    disabled={uploadingImages || newPost.images.length >= 5}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('imageUpload')?.click()}
                    disabled={uploadingImages || newPost.images.length >= 5}
                    className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg hover:from-green-500 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {uploadingImages ? "Uploading..." : "Upload Images"}
                  </button>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {newPost.images.length}/5 images
                  </span>
                </div>
                
                {newPost.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {newPost.images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {user && (user.area || user.city) && (
              <div className="text-sm text-gray-600 dark:text-gray-300 bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                📍 This post will be tagged with your location: {user.area && user.city ? `${user.area}, ${user.city}` : user.area || user.city}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button 
                type="submit" 
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg hover:from-green-500 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                disabled={uploadingImages}
              >
                Create Post
              </button>
              <button 
                type="button" 
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
