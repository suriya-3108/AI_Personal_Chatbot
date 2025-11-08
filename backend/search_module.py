import requests
import config
import json

class SearchModule:
    def __init__(self):
        self.serpapi_key = config.Config.SERPAPI_KEY
    
    def web_search(self, query):
        """Perform web search using SerpAPI"""
        try:
            if not self.serpapi_key or self.serpapi_key == 'your-serpapi-key-here':
                return None  # Search disabled if no API key
            
            params = {
                'q': query,
                'api_key': self.serpapi_key,
                'engine': 'google'
            }
            
            response = requests.get('https://serpapi.com/search', params=params)
            data = response.json()
            
            # Extract relevant information
            search_results = []
            if 'organic_results' in data:
                for result in data['organic_results'][:3]:  # Top 3 results
                    search_results.append({
                        'title': result.get('title', ''),
                        'link': result.get('link', ''),
                        'snippet': result.get('snippet', '')
                    })
            
            return search_results
            
        except Exception as e:
            print(f"Search error: {e}")
            return None
    
    def format_search_results(self, results):
        """Format search results for AI consumption"""
        if not results:
            return "No search results found."
        
        formatted = "Search Results:\n"
        for i, result in enumerate(results, 1):
            formatted += f"{i}. {result['title']}\n   URL: {result['link']}\n   Summary: {result['snippet']}\n\n"
        
        return formatted

# Global instance
search_module = SearchModule()