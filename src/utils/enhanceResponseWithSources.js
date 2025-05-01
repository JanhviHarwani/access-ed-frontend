/**
 * Enhances a response with source information if appropriate
 * @param {string} response - The original response text
 * @param {string[]} sourceUrls - Array of source URLs
 * @param {string[]} sourceTitles - Array of source titles
 * @param {boolean} isGeneralChat - Whether this is a general chat message
 * @returns {string} - The enhanced response text
 */
export const enhanceResponseWithSources = (response, sourceUrls, sourceTitles, isGeneralChat = false) => {
    // Don't add sources for general chat messages
    if (isGeneralChat) {
      return response;
    }
    
    // Don't add sources if there are none
    if (!sourceUrls || sourceUrls.length === 0) {
      return response;
    }
    
    // Don't add sources if they're already in the response
    if (response.includes("For more information") || response.includes("visit:")) {
      return response;
    }
    
    // Add sources section
    let enhancedResponse = response;
    enhancedResponse += "\n\nFor more information, visit:";
    
    sourceUrls.forEach((url, index) => {
      const title = sourceTitles && sourceTitles[index] 
        ? sourceTitles[index] 
        : url.split('/').pop() || "Resource";
      
      enhancedResponse += `\n- [${title}](${url})`;
    });
    
    return enhancedResponse;
  };