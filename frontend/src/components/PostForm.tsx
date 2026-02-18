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
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isEditing ? 'Edit Post' : 'Create New Post'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {errors.general && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className={`mt-1 block w-full border rounded-md px-3 py-2 text-gray-900 bg-white ${errors.title ? 'border-red-300' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            required
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>

                    {/* Content */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Content *
                        </label>
                        <textarea
                            id="content"
                            rows={15}
                            value={formData.content}
                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            className={`mt-1 block w-full border rounded-md px-3 py-2 text-gray-900 bg-white resize-vertical ${errors.content ? 'border-red-300' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            required
                        />
                        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <select
                            id="category"
                            value={formData.category || ''}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                category: e.target.value ? parseInt(e.target.value) : undefined
                            }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
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
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_published"
                            checked={formData.is_published}
                            onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700">
                            Publish immediately
                        </label>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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