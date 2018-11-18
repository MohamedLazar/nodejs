#!/usr/bin/env node

// Modules
const axios = require('axios')
const program = require('commander')
const inquirer = require('inquirer')

program
  .version('1.0.0')
  .option('-f, --films', 'Films')
  .option('-m, --musique', 'Musique')
  .option('-j, --jeux', 'Jeux vidéos')
  .parse(process.argv)

// API opentdb
const URL_THEME = 'https://opentdb.com/api_category.php'
const URL_QUIZ = 'https://opentdb.com/api.php?amount=10&category='
const URL_TYPE = "&difficulty=easy&type=boolean"

let theme = {}
let questionnaire = {}
let score = 0
let reponse = []
let questions = []

// Options des thèmes
function getOptions(){	
    console.log(('-f')+'   Thème : Films')
    console.log(('-m')+'   Thème : Musique')
    console.log(('-j')+'   Thème : Jeux vidéos')
}

// Récuperation des thèmes
function getTheme(){
    axios.get(URL_THEME)
        .then((response) =>{
            theme = response.data
            console.log('Voici les différents thèmes : ')

            // Selection des thèmes
            for(let i = 0; i < theme['trivia_categories'].length; i++){
                if(i == 2 || i == 3 || i == 6){
                    console.log("- "+theme['trivia_categories'][i].name)
                }
            }
        })
        .catch((err)=>{
            console.log('Error', err)
        })
}

// Récuperation des questions en fonction des thèmes
function getQuestions(callback, nb_category){
    axios.get(URL_QUIZ+nb_category+URL_TYPE)
        .then((response) =>{
            questionnaire = response.data['results']
            
            setTimeout(function(){
                callback(questionnaire[0].category, questionnaire)
            },900)
        })
        .catch((err)=>{
            console.log('Error', err)
        })
}

// Quiz
function startQuiz(category_name, questionnaire){
    console.log(('Bienvenue dans ce quiz de '+category_name+' !'))
    console.log(('Répondez Vrai ou Faux à ces 10 questions ! '))
    console.log(('Go !\n'))

    for(let i = 0; i < questionnaire.length; i++){
        let nb_question = i + 1
        questions[i] =  {
            type: 'checkbox',
            message: `Questions n°${nb_question} : ${questionnaire[i].question}\n`,
            name: `reponse${nb_question}`,
            choices: ['Vrai', 'Faux'],
        }
        if(questionnaire[i].correct_answer == 'False'){
            reponse[i] = 'Faux'
        }
        else{
            reponse[i] = 'Vrai'
        }
    }

    // Saisie utilisateur
    inquirer.prompt(questions).then((answer) =>{
        console.log(('\nRésultats : '))
        for(let i = 0; i < 10; i++){
            let nb_question = i + 1
            if(answer[`reponse${nb_question}`][0] == reponse[i]){
                score++
                console.log('Reponse n°'+nb_question+' : '+('Correct'))
            }
            else{
                console.log('Reponse n°'+nb_question+' : '+('Incorrect'))
            }
        }
        console.log(('Votre score : ')+(score+'/10'))    
    })

}

// Lancement du quiz selon l'option
if (program.films){
    getQuestions(startQuiz, 11)
}
else if (program.music){
    getQuestions(startQuiz, 12)
}
else if (program.games){
    getQuestions(startQuiz, 15)
}
else if (program.options){
    getOptions()
}
