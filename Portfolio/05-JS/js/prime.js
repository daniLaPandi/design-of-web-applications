/*
    Prime Factorization - Have the user enter a number and find
    all Prime Factors (if there are any) and display them.
*/

var getPrimeFactors = function (n) {
  "use strict";

  function isPrime(n) {
    for (var i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        return false;
      }
    }
    return true;
  }
  
  var sequence = [];
  for (var i = 2; i <= n; i++){
    if (n % i === 0 && isPrime(i)){
      sequence.push(i);
    }
  }
  //TODO: Check which numbers are factors of n and also check if
  // that number also happens to be a prime

  return sequence;
};

// the prime factors for this number are: [ 2, 3, 5, 7, 11, 13 ]
// console.log(getPrimeFactors(30030));

document.addEventListener("DOMContentLoaded", function(){
  document.getElementById("btn").addEventListener("click", function() {
    var n = parseInt(document.getElementById("num").value);
    if (isNaN(n) || n <= 0) {
      document.getElementById("pf").textContent = "Enter a positive number";
    } else {
      document.getElementById("pf").textContent = getPrimeFactors(n).join(", ");
    }
  });
});