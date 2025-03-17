#include <stdio.h>

// Recursive function to calculate Fibonacci numbers (inefficient)
long long fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    int n = 50;
    long long result = fibonacci(n);
    printf("Fibonacci(%d) = %lld\n", n, result);
    
    return 0;
}
