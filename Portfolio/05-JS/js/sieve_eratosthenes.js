/*
    Sieve of Eratosthenes - The sieve of Eratosthenes is one of the most efficient ways
    to find all of the smaller primes (below 10 million or so).
*/

// TODO: Adjust this script so it can work with the sieve.html file.

var sieve = function (n) {
  "use strict";
  n = parseInt(n);
  if (isNaN(n) || n < 2) return [];

  var isPrime = new Array(n + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  // TODO: Implement the sieve of eratosthenes algorithm to find all the prime numbers under the given number.

  for (var i = 2; i <= Math.sqrt(n); i++) {
    if (isPrime[i]) {
      for (var j = i * i; j <= n; j += i) {
        isPrime[j] = false;
      }
    }
  }

  var primes = [];
  for (var k = 2; k <= n; k++) {
    if (isPrime[k]) {
      primes.push(k);
    }
  }

  return primes;
};


document.addEventListener("DOMContentLoaded", function(){
  document.getElementById("btn").addEventListener("click", function() {
    var n = parseInt(document.getElementById("num").value);
    if (isNaN(n) || n <= 0) {
      document.getElementById("primes").textContent = "Enter a positive number";
    } else {
      document.getElementById("primes").textContent = sieve(n).join(", ");
    }
  });
});