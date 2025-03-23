import { useState } from "react";
import { useContentStore } from "../store/content";
import Navbar from "../components/Navbar";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { Link } from "react-router-dom";

const SearchPage = () => {
	const [activeTab, setActiveTab] = useState("movie");
	const [searchTerm, setSearchTerm] = useState("");
	const [results, setResults] = useState([]);

	const { setContentType } = useContentStore();

	const handleTabClick = (tab) => {
		setActiveTab(tab);
		setContentType(tab);
		setResults([]); // Clear results when switching tabs
	};

	const handleSearch = async (e) => {
		e.preventDefault();
		if (!searchTerm.trim()) {
			toast.error("Please enter a search term.");
			return;
		}

		try {
			const res = await axios.get(`/api/v1/search/${activeTab}/${searchTerm}`);
			setResults(res.data.content);
		} catch (error) {
			toast.error(error.response?.status === 404 
				? `No results found under "${activeTab}". Try a different search term.` 
				: "An error occurred, please try again later."
			);
		}
	};

	return (
		<div className="bg-black min-h-screen text-white">
			<Navbar />
			<div className="container mx-auto px-4 py-8">
				{/* Tabs */}
				<div className="flex justify-center gap-3 mb-4">
					{["movie", "tv", "person"].map((tab) => (
						<button
							key={tab}
							className={`py-2 px-4 rounded ${activeTab === tab ? "bg-red-600" : "bg-gray-800"} hover:bg-red-700`}
							onClick={() => handleTabClick(tab)}
						>
							{tab.charAt(0).toUpperCase() + tab.slice(1)}
						</button>
					))}
				</div>

				{/* Search Input */}
				<form className="flex gap-2 items-stretch mb-8 max-w-2xl mx-auto" onSubmit={handleSearch}>
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder={`Search for a ${activeTab}`}
						className="w-full p-2 rounded bg-gray-800 text-white"
					/>
					<button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded">
						<Search className="size-6" />
					</button>
				</form>

				{/* Results Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{results.length === 0 && <p className="text-center text-gray-400">No results found.</p>}
					{results.map((result) => {
						if (!result.poster_path && !result.profile_path) return null;

						return (
							<div key={result.id} className="bg-gray-800 p-4 rounded">
								<Link to={`/watch/${activeTab}/${result.id}`}>
									<img
										src={result.poster_path ? ORIGINAL_IMG_BASE_URL + result.poster_path : "/default-movie.png"}
										alt={result.title || result.name}
										className="w-full h-auto rounded"
									/>
									<h2 className="mt-2 text-xl font-bold">{result.title || result.name}</h2>
								</Link>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default SearchPage;
