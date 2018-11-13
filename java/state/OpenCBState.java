package state;

import cb.AbstractCircuitBreaker;

public class OpenCBState implements CBState {

    private long stateTime = System.currentTimeMillis();

    @Override
    public String getStateName() {
        return this.getClass().getSimpleName();
    }

    @Override
    public void checkAndSwitchState(AbstractCircuitBreaker cb) {
        long now = System.currentTimeMillis();
        long idleTime = cb.thresholdIdleTimeForOpen * 1000;
        if (stateTime + idleTime <= now) {
            cb.setState(new HalfOpenCBState());
        }
    }

    @Override
    public boolean canPassCheck(AbstractCircuitBreaker cb) {
        checkAndSwitchState(cb);
        return false;
    }

    @Override
    public void countFailNum(AbstractCircuitBreaker cb) {
        // do nothing
    }
}
