
import React, { useState } from 'react';
import axios from 'axios';
import ResultCard from './ResultCard';
import ErrorAlert from './ErrorAlert';

const ClassifyAndSearch = () => {
  const [formData, setFormData] = useState({
    requirement: '',
    top_n: 5,
    use_clustering: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleTopNChange = (e) => {
    const value = parseInt(e.target.value);
    // Enforce the 1-20 limit
    if (value < 1) {
      setFormData({ ...formData, top_n: 1 });
    } else if (value > 20) {
      setFormData({ ...formData, top_n: 20 });
    } else {
      setFormData({ ...formData, top_n: value });
    }
  };

  const validateForm = () => {
    if (!formData.requirement.trim()) {
      setError('Please enter a requirement');
      return false;
    }
    
    if (formData.top_n < 1 || formData.top_n > 20) {
      setError('Top N must be between 1 and 20');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/analyze', {
        requirement: formData.requirement.trim(),
        top_n: formData.top_n,
        use_clustering: formData.use_clustering
      });
      
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      requirement: '',
      top_n: 5,
      use_clustering: false
    });
    setResults(null);
    setError('');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Classify & Find Similar Requirements</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="requirement" className="block text-sm font-medium text-gray-700 mb-1">
              Requirement Text
            </label>
            <textarea
              id="requirement"
              name="requirement"
              value={formData.requirement}
              onChange={handleChange}
              placeholder="Enter a requirement to analyze..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="top_n" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Results (1-20)
              </label>
              <input
                type="number"
                id="top_n"
                name="top_n"
                min="1"
                max="20"
                value={formData.top_n}
                onChange={handleTopNChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="use_clustering"
                name="use_clustering"
                checked={formData.use_clustering}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="use_clustering" className="ml-2 block text-sm text-gray-700">
                Use Clustering
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !formData.requirement.trim()}
              className={`px-4 py-2 rounded-md text-white ${
                loading || !formData.requirement.trim()
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </div>
              ) : (
                'Analyze Requirement'
              )}
            </button>
            {results && (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Reset
              </button>
            )}
          </div>
        </form>

        <ErrorAlert message={error} />

        {results && (
          <div className="mt-8 space-y-6">
            <div className="bg-gray-50 p-4 rounded-md border">
              <h3 className="text-lg font-medium mb-3">Classification Result</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-md shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-500">Type</p>
                  <p className={`font-semibold ${
                    results.classification.type === 'Functional' ? 'text-blue-700' : 'text-purple-700'
                  }`}>
                    {results.classification.type} Requirement
                  </p>
                </div>
                <div className="p-3 bg-white rounded-md shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-500">Confidence</p>
                  <p className="font-semibold">
                    {(results.classification.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Similar Requirements</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {results.similar_requirements.map((item, index) => (
                  <ResultCard
                    key={index}
                    requirement={item.text}
                    similarity={Math.round(item.similarity * 100)}
                    id={item.id}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassifyAndSearch;
