import { useEffect, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";

const useGetTrendingContent = () => {
    const [trendingContent, setTrendingContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const { contentType } = useContentStore();

    useEffect(() => {
        const getTrendingContent = async () => {
            if (!contentType) return; // Prevent invalid API calls

            setLoading(true);
            try {
                const res = await axios.get(`/api/v1/${contentType}/trending`);
                setTrendingContent(res.data.content);
            } catch (error) {
                console.error("Error fetching trending content:", error);
                setTrendingContent([]);
            } finally {
                setLoading(false);
            }
        };

        getTrendingContent();
    }, [contentType]);

    return { trendingContent, loading };
};
export default useGetTrendingContent;
