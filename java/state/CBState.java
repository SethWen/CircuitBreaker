package state;

import cb.AbstractCircuitBreaker;

public interface CBState {

    String getStateName();

    void checkAndSwitchState(AbstractCircuitBreaker cb);

    boolean canPassCheck(AbstractCircuitBreaker cb);

    void countFailNum(AbstractCircuitBreaker cb);
}
