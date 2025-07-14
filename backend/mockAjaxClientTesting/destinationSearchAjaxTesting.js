


function updateDestinationResults(results){
    let destinationResultsRegion = document.getElementById("destination_results");
    //results is an array of strings, showing all possible destinations
    for(let i = 0; i < results.length; i++){
        html += `<li><div>${results[i]}</div</li>`;
    }
    destinationResultsRegion.innerHTML = html;
}