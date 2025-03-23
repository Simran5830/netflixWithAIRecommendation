import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPlayer from "react-player";
import { ORIGINAL_IMG_BASE_URL, SMALL_IMG_BASE_URL } from "../utils/constants";
import { formatReleaseDate } from "../utils/dateFunction";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";

const WatchPage = () => {
	console.log("🚀 WatchPage Mounted!");
	const { id, contentType } = useParams(); // Extract contentType from URL
	console.log("Navigated to WatchPage with:", { id, contentType });
	const [trailers, setTrailers] = useState([]);
	const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0);
	const [loading, setLoading] = useState(true);
	const [content, setContent] = useState(null);
	const [similarContent, setSimilarContent] = useState([]);
	const sliderRef = useRef(null);

	useEffect(() => {
		console.log(`Fetching data for: ${contentType}/${id}`);
		const fetchData = async () => {
			try {
				const [trailerRes, similarRes, contentRes] = await Promise.all([
					axios.get(`/api/v1/${contentType}/${id}/trailers`),
					axios.get(`/api/v1/${contentType}/${id}/similar`),
					axios.get(`/api/v1/${contentType}/${id}/details`),
				]);

				setTrailers(trailerRes.data.trailers);
				setSimilarContent(similarRes.data.similar);
				setContent(contentRes.data.content);
			} catch (error) {
				setContent(null);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [contentType, id]);

	if (loading) return <WatchPageSkeleton />;
	if (!content) return <h2 className="text-center text-white mt-20">Content Not Found 😥</h2>;

	return (
		<div className="bg-black min-h-screen text-white">
			<Navbar />
			<div className="container mx-auto px-4 py-8">
				{trailers.length > 0 && (
					<ReactPlayer
						controls
						width="100%"
						height="70vh"
						className="mx-auto overflow-hidden rounded-lg"
						url={`https://www.youtube.com/watch?v=${trailers[currentTrailerIdx]?.key}`}
					/>
				)}

				{/* Content Details */}
				<div className="mt-8 flex flex-col md:flex-row gap-8">
					<img src={ORIGINAL_IMG_BASE_URL + content.poster_path} alt="Poster" className="max-h-[600px] rounded-md" />
					<div>
						<h2 className="text-5xl font-bold">{content.title || content.name}</h2>
						<p className="text-lg mt-2">{formatReleaseDate(content.release_date || content.first_air_date)}</p>
						<p className="text-lg mt-4">{content.overview}</p>
					</div>
				</div>

				{/* Similar Content */}
				{similarContent.length > 0 && (
					<div className="mt-12">
						<h3 className="text-3xl font-bold">Similar Movies/TV Shows</h3>
						<div className="flex overflow-x-scroll gap-4 scrollbar-hide" ref={sliderRef}>
							{similarContent.map((item) => (
								<Link key={item.id} to={`/watch/${contentType}/${item.id}`}>
									<img src={SMALL_IMG_BASE_URL + item.poster_path} alt="Poster" className="w-52 rounded-md" />
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default WatchPage;
