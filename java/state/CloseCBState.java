package state;

import cb.AbstractCircuitBreaker;

import java.util.concurrent.atomic.AtomicInteger;

public class CloseCBState implements CBState {

    private long stateTime = System.currentTimeMillis();

    private AtomicInteger failNum = new AtomicInteger(0);
    private long failNumClearTime = System.currentTimeMillis();

    @Override
    public String getStateName() {
        return this.getClass().getSimpleName();
    }

    @Override
    public void checkAndSwitchState(AbstractCircuitBreaker cb) {
        long maxFailNum = Long.valueOf(cb.thresholdFailRateForClose.split("/")[0]);
        if (failNum.get() >= maxFailNum) {
            cb.setState(new OpenCBState());
        }

    }

    @Override
    public boolean canPassCheck(AbstractCircuitBreaker cb) {
        return true;
    }

    @Override
    public void countFailNum(AbstractCircuitBreaker cb) {
        long period = Long.valueOf(cb.thresholdFailRateForClose.split("/")[1]) * 1000;
        long now = System.currentTimeMillis();
        if (failNumClearTime + period <= now) {
            failNum.set(0);
        }
        // 12:00 + 10min = 12:10
        failNum.incrementAndGet();
        checkAndSwitchState(cb);
    }
}
