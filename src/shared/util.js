export function getDeckOfCards() {
    return fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(response => {
        // console.log(response);
        return response.json();
    })
    .catch(error => {
        // console.log(error);
        return error;
    });
}

export function getCard(deckId, count){
    return fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`)
    .then(response => {
        // console.log(response);
        return response.json();
    })
    .catch(error => {
        // console.log(error);
        return error;
    });
}