package cb;

import state.CloseCBState;

public class LocalCircuitBreaker extends AbstractCircuitBreaker {
    public LocalCircuitBreaker(String failRateForClose, int idleTimeForOpen,
                               String passRateForHalfOpen, int failNumForHalfOpen) {

        this.thresholdFailRateForClose = failRateForClose;
        this.thresholdIdleTimeForOpen = idleTimeForOpen;
        this.thresholdPassRateForHalfOpen = passRateForHalfOpen;
        this.thresholdFailNumForHalfOpen = failNumForHalfOpen;
    }

    @Override
    public void reset() {
        this.setState(new CloseCBState());
    }

    @Override
    public boolean canPassCheck() {
        return this.getState().canPassCheck(this);
    }

    @Override
    public void countFailNum() {
        this.getState().countFailNum(this);
    }
}
