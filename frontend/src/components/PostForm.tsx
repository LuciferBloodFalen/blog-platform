'use client';

import { useState, useEffect } from 'react';
import { Post, Category, Tag, CreatePostRequest, UpdatePostRequest } from '@/types/api';
import { PostsService, CategoriesService, TagsService } from '@/services';

interface PostFormProps {
    post?: Post | null;
    onSuccess: (post: Post) => void;
    onCancel: () => void;
}

export function PostForm({ post, onSuccess, onCancel }: PostFormProps) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: undefined as number | undefined,
        tags: [] as number[],
        is_published: false,
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEditing = !!post;

    useEffect(() => {
        loadFormData();
    }, []);

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title,
                content: post.content,
                category: post.categories.length > 0 ? post.categories[0].id : undefined,
                tags: post.tags.map(tag => tag.id),
                is_published: post.status === 'published',
            });
        }
    }, [post]);

    const loadFormData = async () => {
        try {
            setLoadingData(true);
            const [categoriesRes, tagsRes] = await Promise.all([
                CategoriesService.getAllCategories({ page_size: 100 }),
                TagsService.getAllTags({ page_size: 100 }),
            ]);
            setCategories(categoriesRes.results);
            setTags(tagsRes.results);
        } catch (error) {
            console.error('Failed to load form data:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const postData: CreatePostRequest | UpdatePostRequest = {
                title: formData.title,
                content: formData.content,
                category: formData.category,
                tags_input: formData.tags, // Send as tags_input for backend
                is_published: formData.is_published,
            };

            let savedPost: Post;
            if (isEditing && post) {
                savedPost = await PostsService.updatePost(post.slug, postData);
            } else {
                savedPost = await PostsService.createPost(postData as CreatePostRequest);
            }

            onSuccess(savedPost);
        } catch (error: any) {
            if (error?.errors) {
                setErrors(error.errors);
            } else {
                setErrors({ general: error.message || 'Failed to save post' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTagToggle = (tagId: number) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tagId)
                ? prev.tags.filter(id => id !== tagId)
                : [...prev.tags, tagId]
        }));
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-lg rounded-lg p-8 border-2 border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-black">
                        {isEditing ? 'Edit Post' : 'Create New Post'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-600 hover:text-black transition-colors p-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {errors.general && (
                    <div className="mb-6 p-4 bg-black text-white rounded-lg border-l-4 border-red-500">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.general}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-black mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className={`block w-full border-2 rounded-lg px-4 py-3 text-black bg-white transition-all duration-200 ${errors.title
                                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                    : 'border-gray-300 focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 hover:border-gray-400'
                                } focus:outline-none`}
                            placeholder="Enter post title"
                            required
                        />
                        {errors.title && <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.title}
                        </p>}
                    </div>

                    {/* Content */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-semibold text-black mb-2">
                            Content *
                        </label>
                        <textarea
                            id="content"
                            rows={15}
                            value={formData.content}
                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            className={`block w-full border-2 rounded-lg px-4 py-3 text-black bg-white resize-vertical transition-all duration-200 ${errors.content
                                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                    : 'border-gray-300 focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 hover:border-gray-400'
                                } focus:outline-none`}
                            placeholder="Write your post content..."
                            required
                        />
                        {errors.content && <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.content}
                        </p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-semibold text-black mb-2">
                            Category
                        </label>
                        <select
                            id="category"
                            value={formData.category || ''}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                category: e.target.value ? parseInt(e.target.value) : undefined
                            }))}
                            className="block w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-black bg-white focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 hover:border-gray-400 transition-all duration-200"
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.category}
                        </p>}
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tags
                        </label>
                        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
                            {tags.map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => handleTagToggle(tag.id)}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${formData.tags.includes(tag.id)
                                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                                        }`}
                                >
                                    #{tag.name}
                                </button>
                            ))}
                        </div>
                        {errors.tags && <p className="mt-1 text-sm text-red-600">{errors.tags}</p>}
                    </div>

                    {/* Publish Status */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-100">
                        <input
                            type="checkbox"
                            id="is_published"
                            checked={formData.is_published}
                            onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                            className="h-5 w-5 text-black focus:ring-black border-2 border-gray-300 rounded transition-colors"
                        />
                        <label htmlFor="is_published" className="text-sm font-medium text-black">
                            Publish immediately
                        </label>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end space-x-4 pt-8 border-t-2 border-gray-100">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 text-sm font-semibold text-black bg-white border-2 border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 text-sm font-semibold text-white bg-black border-2 border-black rounded-lg hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-w-[140px]"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
                                </div>
                            ) : (
                                <span>{isEditing ? 'Update Post' : 'Create Post'}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}