package state;

import cb.AbstractCircuitBreaker;

import java.util.concurrent.atomic.AtomicInteger;

public class HalfOpenCBState implements CBState {

    private long stateTime = System.currentTimeMillis();
    private AtomicInteger failNum = new AtomicInteger(0);
    private AtomicInteger passNum = new AtomicInteger(0);

    @Override
    public String getStateName() {
        return getClass().getSimpleName();
    }

    @Override
    public void checkAndSwitchState(AbstractCircuitBreaker cb) {
        long idleTime = Long.valueOf(cb.thresholdPassRateForHalfOpen.split("/")[1]);
        long now = System.currentTimeMillis();
        if (stateTime + idleTime <= now) {
            int maxFailNum = cb.thresholdFailNumForHalfOpen;
            if (failNum.get() >= maxFailNum) {
                cb.setState(new OpenCBState());
            } else {
                cb.setState(new CloseCBState());
            }
        }
    }

    @Override
    public boolean canPassCheck(AbstractCircuitBreaker cb) {
        checkAndSwitchState(cb);

        int maxPassNum = Integer.valueOf(cb.thresholdPassRateForHalfOpen.split("/")[1]);
        if (passNum.get() > maxPassNum) {
            return false;
        }

        if (passNum.incrementAndGet() <= maxPassNum) {
            return true;
        }
        return false;
    }

    @Override
    public void countFailNum(AbstractCircuitBreaker cb) {
        failNum.incrementAndGet();

        checkAndSwitchState(cb);

    }
}
