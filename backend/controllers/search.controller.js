import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function searchPerson(req, res) {
	const { query } = req.params;
	try {
		const response = await fetchFromTMDB(
			`https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
		);

		if (response.results.length === 0) {
			return res.status(404).send(null);
		}

		await User.findByIdAndUpdate(req.user._id, {
			$push: {
				searchHistory: {
					id: response.results[0].id,
					image: response.results[0].profile_path,
					title: response.results[0].name,
					searchType: "person",
					createdAt: new Date(),
				},
			},
		});

		res.status(200).json({ success: true, content: response.results });
	} catch (error) {
		console.log("Error in searchPerson controller: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function searchMovie(req, res) {
	const { query } = req.params;

	try {
		if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

		const response = await fetchFromTMDB(
			`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
		);

		if (!response.results || response.results.length === 0) {
			return res.status(404).json({ success: false, message: "No results found" });
		}

		const movie = response.results[0];

		await User.findByIdAndUpdate(req.user._id, {
			$addToSet: {
				searchHistory: {
					id: movie.id,
					image: movie.poster_path,
					title: movie.title,
					searchType: "movie",
					createdAt: new Date(),
				},
			},
		});

		res.status(200).json({ success: true, content: response.results });
	} catch (error) {
		console.error("Error in searchMovie controller:", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function searchTv(req, res) {
	const { query } = req.params;

	try {
		if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

		const response = await fetchFromTMDB(
			`https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
		);

		if (!response.results || response.results.length === 0) {
			return res.status(404).json({ success: false, message: "No results found" });
		}

		const tvShow = response.results[0];

		await User.findByIdAndUpdate(req.user._id, {
			$addToSet: {
				searchHistory: {
					id: tvShow.id,
					image: tvShow.poster_path,
					title: tvShow.name,
					searchType: "tv",
					createdAt: new Date(),
				},
			},
		});

		res.json({ success: true, content: response.results });
	} catch (error) {
		console.error("Error in searchTv controller:", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getSearchHistory(req, res) {
	try {
		if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

		res.status(200).json({ success: true, content: req.user.searchHistory || [] });
	} catch (error) {
		console.error("Error in getSearchHistory controller:", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function removeItemFromSearchHistory(req, res) {
	const { id } = req.params;

	try {
		if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

		await User.findByIdAndUpdate(req.user._id, {
			$pull: {
				searchHistory: { id: id }, // Keep ID as a string
			},
		});

		res.status(200).json({ success: true, message: "Item removed from search history" });
	} catch (error) {
		console.error("Error in removeItemFromSearchHistory controller:", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}