package cb;

public interface CircuitBreaker {

    void reset();

    boolean canPassCheck();

    void countFailNum();
}
