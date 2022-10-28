const PlayerAircraft = document.querySelector('.playerFigure');
const main = document.querySelector('.main');
const frame = document.querySelector('.frame');
var checkboxEasy = document.getElementById('easy');
var checkboxNormal = document.getElementById('normal');
var checkboxHard = document.getElementById('hard');
var checkboxDynamic = document.getElementById('dynamic');
var form = document.querySelector('.form');
var arrows = document.querySelector('.arrows');
var leftArrow = document.querySelector('.left');
var rightArrow = document.querySelector('.right');
var pointImg = '<img src="./img/point1.png" alt="ship" class="point1" />';
var meteorImg = '<img src="./img/meteor.png" alt="ship" class="meteor" />';
var ship = 0;
var ships = [
  '<img src="./img/ship1.png" alt="ship" class="ship" />',
  '<img src="./img/ship2.png" alt="ship" class="ship" />',
  '<img src="./img/ship3.png" alt="ship" class="ship" />',
  '<img src="./img/ship4.png" alt="ship" class="ship" />',
];
var score = 0;
var speed = 2000;
var dynamicSpeed = false;
var playerSpeed = 1600;
var scoreElement = document.querySelector('.score');
var highScoreElement = document.querySelector('.highScore');
var startNotice = document.querySelector('.startNotice');
var popup = document.querySelector('.popup');
var ClosePopupBtn = document.querySelector('.closePopup');
var popupH1 = document.querySelector('.textInPopupH1');
var popupP = document.querySelector('.textInPopupP');
var started = false;

// set start styles & reset checkboxes
checkboxDynamic.checked = false;
checkboxEasy.checked = false;
checkboxNormal.checked = true;
checkboxHard.checked = false;
PlayerAircraft.style.left = window.innerWidth / 2 - 40 + 'px';
PlayerAircraft.style.bottom = 150 + 'px';

PlayerAircraft.innerHTML = ships[ship];
highScoreElement.innerHTML = 'HIGH SCORE: ' + localStorage['HighScore'] + '<br/>' + 'SCORE: ' + localStorage['Score'];

// loops
scoreCounter = setInterval(function () {
  let points = document.querySelectorAll('.point');
  let meteors = document.querySelectorAll('.meteorDiv');

  points.forEach((point) => {
    let leftToCenterOfPoint = getPosLeft(point) + 20;
    let leftToCenterOfPlayer = getPosLeft(PlayerAircraft) + 40;
    let TopToCenterOfPoint = getPosTop(point) + 20;
    let TopToCenterOfPlayer = getPosTop(PlayerAircraft) + 40;
    let bottomToPlayer = getPosBottom(point);
    if (leftToCenterOfPoint < leftToCenterOfPlayer + 60 && leftToCenterOfPoint > leftToCenterOfPlayer - 60) {
      if (TopToCenterOfPoint > TopToCenterOfPlayer - 60) {
        score += 1;
        point.parentNode.removeChild(point);
        pointGenerator();
        if (dynamicSpeed) {
          setDynamicSpeed();
        }
        return;
      }
    } else if (bottomToPlayer < -20) {
      point.parentNode.removeChild(point);
      PlayerAircraft.parentNode.removeChild(PlayerAircraft);
      document.querySelector('.meteor').parentNode.removeChild(document.querySelector('.meteor'));
      speed = 0;
      updateAnimations();
      if (parseInt(localStorage['HighScore']) < score) {
        localStorage['HighScore'] = String(score);
        popup.classList.remove('hide');
        popupH1.innerHTML = 'YOU MISSED A COIN <br/><br/> NEW HIGH SCORE';
        popupP.innerHTML = score;
      } else {
        popup.classList.remove('hide');
        popupH1.innerHTML = 'YOU MISSED A COIN <br/><br/> SCORE';
        popupP.innerHTML = score;
      }
      ClosePopupBtn.addEventListener('click', function () {
        location.reload(true);
        return;
      });
      document.addEventListener('keydown', function (event) {
        if (event.key == ' ') {
          location.reload(true);
          return;
        }
      });
    }
    if (leftToCenterOfPlayer < 60) {
      PlayerAircraft.classList.remove('left');
      PlayerAircraft.style.left = 0;
      updateAnimations();
    }
    if (leftToCenterOfPlayer > window.innerWidth - 42) {
      PlayerAircraft.classList.remove('right');
      PlayerAircraft.style.left = window.innerWidth - 80 + 'px';
      updateAnimations();
    }

    meteors.forEach((meteor) => {
      if (getPosBottom(meteor) < 1) {
        meteor.parentNode.removeChild(meteor);
        updateMeteorAnimations();
        meteorGenerator();
      }
    });
  });

  meteors.forEach((meteor) => {
    let leftToCenterOfMeteor = getPosLeft(meteor) + 20;
    let leftToCenterOfPlayer = getPosLeft(PlayerAircraft) + 40;
    let TopToCenterOfMeteor = getPosTop(meteor) + 250;
    let TopToCenterOfPlayer = getPosTop(PlayerAircraft) + 40;
    if (leftToCenterOfMeteor < leftToCenterOfPlayer + 40 && leftToCenterOfMeteor > leftToCenterOfPlayer - 40) {
      if (TopToCenterOfMeteor > TopToCenterOfPlayer - 40) {
        PlayerAircraft.parentNode.removeChild(PlayerAircraft);
        document.querySelector('.meteorDiv').parentNode.removeChild(document.querySelector('.meteorDiv'));
        document.querySelector('.point').parentNode.removeChild(document.querySelector('.point'));
        speed = 0;
        updateAnimations();
        if (parseInt(localStorage['HighScore']) < score) {
          localStorage['HighScore'] = String(score);
          popup.classList.remove('hide');
          popupH1.innerHTML = 'YOU GOT HIT BY A METEOR <br/><br/> NEW HIGH SCORE';
          popupP.innerHTML = score;
        } else {
          popup.classList.remove('hide');
          popupH1.innerHTML = 'YOU GOT HIT BY A METEOR <br/><br/> SCORE';
          popupP.innerHTML = score;
        }
        ClosePopupBtn.addEventListener('click', function () {
          location.reload(true);
          return;
        });
        document.addEventListener('keydown', function (event) {
          if (event.key == ' ') {
            location.reload(true);
            return;
          }
        });
      }
    } else {
    }
    meteors.forEach((meteor) => {
      if (getPosBottom(meteor) < 1) {
        meteor.parentNode.removeChild(meteor);
        updateMeteorAnimations();
        meteorGenerator();
      }
    });
  });
}, 1);

setScore = setInterval(function () {
  document.querySelector('.score').innerText = score;
  localStorage['Score'] = score;
  if (parseInt(localStorage['HighScore']) < score) {
    scoreElement.style.color = 'red';
  }
}, 100);

// functions
function setDynamicSpeed() {
  let sub = score * 5;
  speed = speed - sub;
}
function meteorGenerator() {
  frame.insertAdjacentHTML('beforeend', '<div class="meteorDiv meteorDown">' + meteorImg + '</div>');
  let meteorDiv = document.querySelector('.meteorDiv');
  meteorDiv.style.top = 0;
  meteorDiv.style.left = getRanInt(window.innerWidth - 20) + 'px';

  let meteor = document.querySelector('.point');
  if (meteor != null && parseInt(meteorDiv.style.left) > getPosLeft(meteor) && parseInt(meteorDiv.style.left) < getPosLeft(meteor) + 40) {
    document.querySelector('.meteor').parentNode.removeChild(document.querySelector('.meteor'));
    meteorGenerator();
  } else {
  }
}
async function pointGenerator() {
  frame.insertAdjacentHTML('beforeend', '<div class="point Down">' + pointImg + '</div>');
  let point = document.querySelector('.point');
  point.style.top = 0;
  point.style.left = getRanInt(window.innerWidth - 20) + 'px';
}
function getPlayerDistanceLeft() {
  return window.getComputedStyle(PlayerAircraft).getPropertyValue('left');
}
function getPosLeft(element) {
  return parseInt(window.getComputedStyle(element).getPropertyValue('left'));
}
function getPosTop(element) {
  return parseInt(window.getComputedStyle(element).getPropertyValue('top'));
}
function getPosBottom(element) {
  return parseInt(window.getComputedStyle(element).getPropertyValue('bottom'));
}
function workoutDistanceLeft() {
  let res = parseInt(getPlayerDistanceLeft()) / window.innerWidth;
  res = parseInt(playerSpeed * res);
  return res;
}
function workoutDistanceRight() {
  let res = (window.innerWidth - parseInt(getPlayerDistanceLeft())) / window.innerWidth;
  res = parseInt(playerSpeed * res);
  return res;
}

function getRanInt(max) {
  return Math.floor(Math.random() * max);
}
function getRandMeteorSpeed() {
  let res = parseInt(speed / Math.random() / 2);
  return res;
}
function updateAnimations() {
  var animations =
    `
        .Down {
                animation: goDown ` +
    speed +
    `ms linear;
              }
        .right {
            animation: goRight  ` +
    workoutDistanceRight() +
    `ms linear;
        }

        @keyframes goRight {
            from {
                left: ` +
    getPlayerDistanceLeft +
    `;
            }

            to {
                left: 100vw;
            }
        }

        .left {
            animation: goLeft ` +
    workoutDistanceLeft() +
    `ms linear;
        }

        @keyframes goLeft {
            form {
                left: ` +
    getPlayerDistanceLeft +
    `;
            }

            to {
                left: 0;
            }
        }

        .background1 {
    top: -100vh;
    animation: moveBackground1 linear infinite ` +
    speed +
    `ms;
}

.background2  {
    top: 0;
    animation: moveBackground2 linear infinite ` +
    speed +
    `ms;
}
      `;

  var styleSheet = document.createElement('style');
  styleSheet.innerText = animations;
  document.head.appendChild(styleSheet);
}
function updateMeteorAnimations() {
  var animations =
    `        .meteorDown  {
          animation: goDown ` +
    getRandMeteorSpeed() +
    `ms linear infinite ;
        }`;

  var styleSheet = document.createElement('style');
  styleSheet.innerText += animations;
  document.head.appendChild(styleSheet);
}

// listeners

leftArrow.addEventListener('click', function () {
  if (ship == 0) {
  } else {
    ship--;
    PlayerAircraft.innerHTML = ships[ship];
  }
});
rightArrow.addEventListener('click', function () {
  if (ship == ships.length - 1) {
  } else {
    ship++;
    PlayerAircraft.innerHTML = ships[ship];
  }
});

document.addEventListener('keydown', async function (event) {
  if (event.key == ' ' && started == false) {
    if (checkboxEasy.checked) {
      speed = 8000;
    } else if (checkboxNormal.checked) {
      speed = 2000;
    } else if (checkboxHard.checked) {
      speed = 1000;
      playerSpeed = 1000;
    } else if (checkboxDynamic.checked) {
      dynamicSpeed = true;
      playerSpeed = 900;
    }
    PlayerAircraft.style.bottom = 0;
    startNotice.innerText = 'GO';
    form.parentNode.removeChild(form);
    arrows.parentNode.removeChild(arrows);
    highScoreElement.parentNode.removeChild(highScoreElement);
    await new Promise((r) => setTimeout(r, 500));
    startNotice.parentNode.removeChild(startNotice);
    updateAnimations();
    updateMeteorAnimations();
    meteorGenerator();
    pointGenerator();
    started = true;
  }
  if (PlayerAircraft.classList.contains('left') || PlayerAircraft.classList.contains('right') || started == false) {
    return;
  } else {
    if (event.key == 'ArrowLeft' && !PlayerAircraft.classList.contains('left') && parseInt(getPlayerDistanceLeft()) > 2) {
      PlayerAircraft.classList.add('left');
      updateAnimations();
    } else if (event.key == 'ArrowRight' && window.innerWidth - parseInt(getPlayerDistanceLeft()) > 82) {
      PlayerAircraft.classList.add('right');
      updateAnimations();
    }
  }
});

document.addEventListener('keyup', function (event) {
  if (event.key == 'ArrowLeft' && PlayerAircraft.classList.contains('left')) {
    PlayerAircraft.style.left = getPlayerDistanceLeft();
    updateAnimations();
    PlayerAircraft.classList.remove('left');
  }
  if (event.key == 'ArrowRight' && PlayerAircraft.classList.contains('right')) {
    PlayerAircraft.style.left = getPlayerDistanceLeft();
    updateAnimations();
    PlayerAircraft.classList.remove('right');
  }
});

checkboxEasy.addEventListener('change', function (e) {
  if (checkboxEasy.checked) {
    checkboxNormal.checked = false;
    checkboxHard.checked = false;
    checkboxDynamic.checked = false;
  }
});

checkboxNormal.addEventListener('change', function (e) {
  if (checkboxNormal.checked) {
    checkboxEasy.checked = false;
    checkboxHard.checked = false;
    checkboxDynamic.checked = false;
  }
});

checkboxHard.addEventListener('change', function (e) {
  if (checkboxHard.checked) {
    checkboxEasy.checked = false;
    checkboxNormal.checked = false;
    checkboxDynamic.checked = false;
  }
});

checkboxDynamic.addEventListener('change', function (e) {
  if (checkboxDynamic.checked) {
    checkboxEasy.checked = false;
    checkboxNormal.checked = false;
    checkboxHard.checked = false;
  }
});
