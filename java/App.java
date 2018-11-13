import cb.CircuitBreaker;
import cb.LocalCircuitBreaker;

import java.util.Random;
import java.util.concurrent.CountDownLatch;

public class App {

    public static void main(String[] args) throws InterruptedException {
        final int maxNum = 200;
        final CountDownLatch countDownLatch = new CountDownLatch(maxNum);
        final CircuitBreaker circuitBreaker = new LocalCircuitBreaker("5/20", 10, "3/10", 8);

        for (int i = 0; i < maxNum; i++)
            new Thread(() -> {
                try {
                    Thread.sleep(new Random().nextInt(20) * 1000);
                } catch (Exception e) {
                    e.printStackTrace();
                }

                try {
                    if (circuitBreaker.canPassCheck()) {
                        System.out.println("一切正常--" + countDownLatch.getCount());

//                        if (countDownLatch.getCount() >= maxNum / 2) {
//                            if (new Random().nextInt(2) == 1) {
                                throw new Exception("mock error");
//                            }
//                        }

                    } else {
                        System.out.println("拦截业务逻辑");
                    }
                } catch (Exception e) {
                    System.out.println("业务执行失败了--" + countDownLatch.getCount());
                    circuitBreaker.countFailNum();
                }
                countDownLatch.countDown();
            }).start();

        countDownLatch.await();
        System.out.println("end");
    }
}