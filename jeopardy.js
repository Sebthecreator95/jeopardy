// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]
const jeopardyAPI = "https://jservice.io/api/";
const categories = 6;
const questions = 5;






let gameCategories = [];


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    let response = await axios.get(`${jeopardyAPI}categories?count=100`);
    let categoryIds = response.data.map(c => c.id);
    return _.sampleSize(categoryIds, categories);
  }


  /** Return object with data about a category:
   *
   *  Returns { title: "Math", clues: clue-array }
   *
   * Where clue-array is:
   *   [
   *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
   *      {question: "Bell Jar Author", answer: "Plath", showing: null},
   *      ...
   *   ]
   */
  
  async function getCategory(categoryId) {
    let response = await axios.get(`${jeopardyAPI}category?id=${categoryId}`);
    let category = response.data;
    let allClues = category.clues;
    let randomClues = _.sampleSize(allClues, questions);
    let clues = randomClues.map(c => ({
      question: c.question,
      answer: c.answer,
      showing: null,
    }));
  
    return { title: category.title, clues };
  }
  




/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    $("#jeopardy thead").empty();
    let $tr = $("<tr>");
    for (let catIdx = 0; catIdx < categories; catIdx++) {
      $tr.append($("<th>").text(gameCategories[catIdx].title));
    }
    $("#jeopardy thead").append($tr);
  
    // Add rows with questions for each category
    $("#jeopardy tbody").empty();
    for (let clueIdx = 0; clueIdx < questions; clueIdx++) {
      let $tr = $("<tr>");
      for (let catIdx = 0; catIdx < categories; catIdx++) {
        $tr.append($("<td>").attr("id", `${catIdx}-${clueIdx}`).text("?"));
      }
      $("#jeopardy tbody").append($tr);
    }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */
  
  function handleClick(evt) {
    let id = evt.target.id;
    let [categoryId, clueId] = id.split("-");
    let clue = gameCategories[categoryId].clues[clueId];
  
    let msg;
  
    if (!clue.showing) {
      msg = clue.question;
      clue.showing = "question";
    } else if (clue.showing === "question") {
      msg = clue.answer;
      clue.showing = "answer";
    } else {
      // already showing answer; ignore
      return
    }
    $(`#${categoryId}-${clueId}`).html(msg);
}



/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    let categoryIds = await getCategoryIds();

    gameCategories = [];
   
    for (let categoryId of categoryIds) {
      gameCategories.push(await getCategory(categoryId));
    }
  
    fillTable();
  }
  
  /** On click of restart button, restart game. */
  
  $("#restart").on("click", setupAndStart);
  
  /** On page load, setup and start & add event handler for clicking clues */
  
  $(async function () {
      setupAndStart();
      $("#jeopardy").on("click", "td", handleClick);
    }
  );

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO
 


