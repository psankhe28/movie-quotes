import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searchDone, setSearchDone] = useState(false);
    const [sortByYearAsc, setSortByYearAsc] = useState(true);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [years, setYears] = useState([]);
    const [categories, setCategories] = useState([]);
    const [prevFilters, setPrevFilters] = useState([]);
    const [prevResults, setPrevResults] = useState([]);
    const [loading, setLoading] = useState(false)

    const fetchDropdownOptions = async (query) => {
        try {
            const yearsResponse = await axios.get(`https://localhost:5000/years?query=${query}`);
            setYears(yearsResponse.data);

            const categoriesResponse = await axios.get(`https://localhost:5000/categories?query=${query}`);
            setCategories(categoriesResponse.data);
        } catch (error) {
            console.error('Error fetching dropdown options:', error);
        }
    };

    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSubmit = async (event) => {
        setSearchDone(true);
        setLoading(true)
        event.preventDefault();
        try {
            const response = await axios.get(`https://localhost:5000/search?query=${query}`);
            const uniqueResults = filterUniqueMovieLines(response.data);
            setResults(uniqueResults);
            await fetchDropdownOptions(query);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false)
    };

    const filterUniqueMovieLines = (data) => {
        const movieLinesSet = new Set();
        return data.filter((item) => {
            if (!movieLinesSet.has(item['Movie Line'])) {
                movieLinesSet.add(item['Movie Line']);
                return true;
            }
            return false;
        });
    };

    const sortByYear = () => {
        const sortedResults = [...results].sort((a, b) => {
            if (sortByYearAsc) {
                return a.Year - b.Year; // Ascending order
            } else {
                return b.Year - a.Year; // Descending order
            }
        });
        setResults(sortedResults);
        setSortByYearAsc(!sortByYearAsc); // Toggle sorting order
    };

    const sortByCategory = () => {
        const sortedResults = [...results].sort((a, b) => a.Category.localeCompare(b.Category));
        setResults(sortedResults);
    };

    const goBack = () => {
        setResults(prevResults);
        const prevFilter = prevFilters.pop();
        setSelectedYear(prevFilter.selectedYear);
        setSelectedCategory(prevFilter.selectedCategory);
    };

    useEffect(() => {
        const filterResults = () => {
            setResults(prevResults => {
                let filteredResults = [...prevResults];
                if (selectedYear !== '') {
                    filteredResults = filteredResults.filter((quote) => quote.Year === selectedYear);
                }
                if (selectedCategory !== '') {
                    filteredResults = filteredResults.filter((quote) => quote.Category === selectedCategory);
                }
                setPrevFilters([{ selectedYear, selectedCategory }]);
                setPrevResults([...prevResults]);
                return filteredResults;
            });
        };
        filterResults();
    }, [selectedYear, selectedCategory]);

    return (
        <div className='app'>
            <h1>Movie Quote Search</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder="Search..."
                />
                <button type="submit">Search</button>
            </form>
            {results.length > 0 && (
                <div className='filters'>
                    <div className='filter-button'>
                        {results.length > 1 && (
                            <div className='filter'>
                                <label htmlFor="year">Year:</label>
                                <select
                                    id="year"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                >
                                    <option value="">Select year</option>
                                    {years.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                <button onClick={sortByYear}>
                                    {sortByYearAsc ? 'Sort by Year Asc' : 'Sort by Year Desc'}
                                </button>
                            </div>
                        )}
                        {results.length > 1 && (
                            <div className='filter'>
                                <label htmlFor="category">Category:</label>
                                <select
                                    id="category"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">Select category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                                <button onClick={sortByCategory}>Sort by Category</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className='results'>
                {results.length > 0 ? (
                    <div>
                        <h3>No. of results: {results.length}</h3>
                        <ul>
                            {results.map((quote, index) => (
                                <li key={index}>
                                    <div className="card">
                                        <h1 className="heading">{quote['Movie Line']}</h1>
                                        <div className='btn'>
                                            <button className="button">{quote['Year']}</button>
                                            <button className="button">{quote['Category']}</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    !loading && searchDone && <p>No results found</p>
                )}
            </div>
            {loading && <p>Loading...</p>}
            {!loading && searchDone && prevFilters.length > 0 && (
                <div className='filter prev'>
                    <button onClick={goBack}>Go Back</button>
                </div>
            )}
        </div>
    );
}

export default App;
