'use strict';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Raphael from 'raphael';
Vue.use(VueRouter);

import App from './Components/App/index.vue';

export const router = new VueRouter({
  base: __dirname,
  routes: [
    {
        name: 'app',
        path: '/:fmt/:tz',
        component: App
    },
    {
        name: 'app-with-style',
        path: '/:fmt/:tz/:style',
        component: App
    },
  ]
});

const chars = {
          "0": "M 24.585635359116,55.2486187845304 C 24.585635359116,33.1491712707182 37.0165745856354,09.94475138121547 55.2486187845304,09.94475138121547 C 73.4806629834254,09.94475138121547  86.1878453038674,33.1491712707182 86.1878453038674,55.2486187845304 C 86.1878453038674,77.3480662983425 73.4806629834254,99.4475138121547 55.2486187845304,99.4475138121547 C 37.0165745856354,99.4475138121547 24.585635359116,77.3480662983425 24.585635359116,55.2486187845304",
          "1": "M 42.5414364640884,11.3259668508287 C 42.5414364640884,11.3259668508287 57.7348066298343,11.3259668508287 57.7348066298343,11.3259668508287 C 57.7348066298343,11.3259668508287 57.7348066298343,100 57.7348066298343,100 C 57.7348066298343,100 57.7348066298343,100 57.7348066298343,100 C 57.7348066298343,100 57.7348066298343,100 57.7348066298343,100",
          "2": "M 30.939226519337,33.1491712707182 C 32.5966850828729,01.10497237569061 79.0055248618785,02.20994475138122 79.8342541436464,33.7016574585635 C 79.8342541436464,43.0939226519337 71.8232044198895,54.1436464088398 59.6685082872928,67.4033149171271 C 51.9337016574586,76.2430939226519 40.8839779005525,85.6353591160221 31.4917127071823,97.7900552486188 C 31.4917127071823,97.7900552486188 81.2154696132597,97.7900552486188 81.2154696132597,97.7900552486188",
          "3": "M 36.1878453038674,29.8342541436464 C 34.8066298342541,14.9171270718232 47.5138121546961,09.94475138121547 54.9723756906077,09.94475138121547 C 86.1878453038674,09.94475138121547 80.6629834254144,53.0386740331492 54.9723756906077,53.0386740331492 C 87.292817679558,53.0386740331492 82.8729281767956,99.4475138121547 55.2486187845304,99.4475138121547 C 29.8342541436464,99.4475138121547 30.939226519337,82.8729281767956 31.2154696132597,79.0055248618785",
          "4": "M 85.6353591160221,80.6629834254144 C 85.6353591160221,80.6629834254144 23.7569060773481,80.6629834254144 23.7569060773481,80.6629834254144 C 23.7569060773481,80.6629834254144 71.2707182320442,13.8121546961326 71.2707182320442,13.8121546961326 C 71.2707182320442,13.8121546961326 71.2707182320442,80.6629834254144 71.2707182320442,80.6629834254144 C 71.2707182320442,80.6629834254144 71.2707182320442,98.8950276243094 71.2707182320442,98.8950276243094",
          "5": "M 80.6629834254144,11.0497237569061 C 50.2762430939227,11.0497237569061 50.2762430939227,11.0497237569061 50.2762430939227,11.0497237569061 C 39.7790055248619,43.0939226519337 39.7790055248619,43.0939226519337 39.7790055248619,43.0939226519337 C 53.5911602209945,36.4640883977901 80.1104972375691,46.9613259668508 80.1104972375691,71.2707182320442 C 77.3480662983425,101.104972375691 37.5690607734807,109.39226519337 24.8618784530387,85.0828729281768",
          "6": "M 60.7734806629834,11.0497237569061 C 60.7734806629834,11.0497237569061 60.7734806629834,11.0497237569061 60.7734806629834,11.0497237569061 C 39.2265193370166,43.646408839779 26.5193370165746,50.828729281768 25.414364640884,69.6132596685083 C 28.7292817679558,113.017127071823 87.292817679558,106.077348066298 84.5303867403315,69.6132596685083 C 80.6629834254144,36.4640883977901 41.9889502762431,35.3591160220994 29.5580110497238,55.2486187845304",
          "7": "M 25.9668508287293,11.6022099447514 C 25.9668508287293,11.6022099447514 87.292817679558,11.6022099447514 87.292817679558,11.6022099447514 C 87.292817679558,11.6022099447514 70,42.2099447513812 70,42.2099447513812 C 70,42.2099447513812 47.7348066298343,73.3149171270718 47.7348066298343,73.3149171270718 C 47.7348066298343,73.3149171270718 25.414364640884,100 25.414364640884,100",
          "8": "M 55.8011049723757,53.0386740331492 C 24.3093922651934,52.4861878453039 24.3093922651934,10.4972375690608 55.8011049723757,10.4972375690608 C 85.0828729281768,10.4972375690608 85.0828729281768,53.0386740331492 55.8011049723757,53.0386740331492 C 24.3093922651934,53.0386740331492 19.8895027624309,98.8950276243094 55.8011049723757,98.8950276243094 C 85.0828729281768,98.8950276243094 85.0828729281768,53.0386740331492 55.8011049723757,53.0386740331492",
          "9": "M 80.939226519337,55.2486187845304 C 68.5082872928177,75.1381215469613 29.8342541436464,74.0331491712707 25.9668508287293,40.8839779005525 C 23.2044198895028,04.41988950276243 81.767955801105,-4.41988950276243 85.0828729281768,40.8839779005525 C 83.9779005524862,59.6685082872928 71.2707182320442,66.8508287292818 49.7237569060773,99.4475138121547 C 49.7237569060773,99.4475138121547 49.7237569060773,99.4475138121547 49.7237569060773,99.4475138121547",
          ":": "M 50, 35 m -2, 0 a 2,2 0 1,0 4,0 a 2,2 0 1,0 -4,0 M 50, 85 m -2, 0 a 2,2 0 1,0 4,0 a 2,2 0 1,0 -4,0",
          ".": "M 50, 95 m -2, 0 a 2,2 0 1,0 4,0 a 2,2 0 1,0 -4,0",
          " ": ""
        };


Vue.directive('tween-chars', (el, binding, vnode) => {
    if (el.children.length < binding.value.value.length) {
        el.tweenHolders = [];
        el.innerHTML = "";
        for (let i = 0; i < binding.value.value.length; i++) {
            let holder = document.createElement('span');
            el.tweenHolders[i] = Raphael(holder, 120, 120).path(chars[binding.value.value[i]]).attr({
                "stroke": binding.value.color ? binding.value.color : "#fff",
                "stroke-width": "4",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
            });
            el.appendChild(holder);
        }
        return;
    }


    for (let i = 0; i < el.children.length; i++) {
        let char;
        if (i < binding.value.value.length) {
            char = chars[binding.value.value[i]];
            el.children[i].style.display = "inline-block";
        }
        else {
            char = ' ';
            el.children[i].style.display = "none";
        }
        el.tweenHolders[i] = el.tweenHolders[i].animate({path: char}, 250).attr({
            "stroke": binding.value.color ? binding.value.color : "#fff",
            "stroke-width": "4",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
        });
    }
});

Vue.directive('copy-on-click', {
    bind: (el) => {
        el.addEventListener('click', (e) => {
            let textarea = document.createElement('textarea');
            let success = undefined;
            let failed = undefined;
            if (typeof(el.CopyOnClickValue) === "object") {
                textarea.appendChild(document.createTextNode(el.CopyOnClickValue.value));
                success = el.CopyOnClickValue.success;
                failed = el.CopyOnClickValue.failed;
            }
            else {
                textarea.appendChild(document.createTextNode(el.CopyOnClickValue));
            }
            textarea.style.position = "fixed";
            textarea.style.left = "-100px";
            textarea.style.top = "-100px";
            textarea.style.opacity = 0;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                if (document.execCommand('copy')) {

                    if (success !== undefined) {
                        success();
                    }
                }
                else {
                    if (failed !== undefined) {
                        failed();
                    }
                }
            }
            catch (err) {
                if (failed !== undefined) {
                    failed(err);
                }
                else {
                    console.error(err);
                }
            }
            textarea.remove();
        });
    },
    update: (el, binding) => {
        el.CopyOnClickValue = binding.value;
    }
});

new Vue({
    el: '#app',
    router: router,
    render: h => h(App)  
});
