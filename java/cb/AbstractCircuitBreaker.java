package cb;

import state.CBState;
import state.CloseCBState;

public class AbstractCircuitBreaker implements CircuitBreaker {

    /**
     * 熔断器当前状态
     */
    private volatile CBState state = new CloseCBState();

    /**
     * 600s 内失败 10次， 那么熔断器打开
     */
    public String thresholdFailRateForClose = "10/600";

    /**
     * 在熔断器打开的情况下， 熔断多少秒进入半开状态， 默认 1800s
     */
    public int thresholdIdleTimeForOpen = 1800;

    /**
     * 在熔断器半开的情况下， 在多少秒内放多少次请求， 去试探， 默认 600s 内放 10次 请求
     */
    public String thresholdPassRateForHalfOpen = "10/600";

    /**
     * 在熔断器半开的情况下， 试探期间， 如果有超过多少次失败的， 重新进入到熔断状态， 否则进入到打开状态
     */
    public int thresholdFailNumForHalfOpen = 1;


    public CBState getState() {
        return state;
    }

    public void setState(CBState state) {
        CBState currentState = getState();
        if (currentState.getStateName().equals(state.getStateName())) {
            return;
        }

        synchronized (this) {
            currentState = getState();
            if (currentState.getStateName().equals(state.getStateName())) {
                return;
            }

            this.state = state;
            System.out.println(String.format("state has changed from %s to %s", currentState.getStateName(), state.getStateName()));

        }
    }


    @Override
    public void reset() {

    }

    @Override
    public boolean canPassCheck() {
        return false;
    }

    @Override
    public void countFailNum() {

    }
}
