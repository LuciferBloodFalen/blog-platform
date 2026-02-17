import { PaginatedResponse, Post } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Server-side API client for fetching data in Server Components
 * This bypasses authentication and only fetches public data
 */
export class ServerApiClient {
    private static baseUrl = API_BASE_URL;

    static async fetchPublishedPosts(params?: {
        page?: number;
        page_size?: number;
        search?: string;
        category?: string;
        tag?: string;
    }): Promise<PaginatedResponse<Post>> {
        const queryParams = new URLSearchParams();

        // Always filter for published posts
        queryParams.append('status', 'published');

        // Add other params if provided
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.category) queryParams.append('category', params.category);
        if (params?.tag) queryParams.append('tag', params.tag);

        const url = `${this.baseUrl}/posts/?${queryParams.toString()}`;

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            next: {
                revalidate: 60, // Revalidate every minute
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }

        return response.json();
    }

    static async fetchPostBySlug(slug: string): Promise<Post> {
        const url = `${this.baseUrl}/posts/slug/${slug}/`;

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            next: {
                revalidate: 300, // Revalidate every 5 minutes
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch post: ${response.statusText}`);
        }

        return response.json();
    }

    static async fetchFeaturedPosts(): Promise<Post[]> {
        const url = `${this.baseUrl}/posts/featured/`;

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            next: {
                revalidate: 300, // Revalidate every 5 minutes
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch featured posts: ${response.statusText}`);
        }

        return response.json();
    }
}