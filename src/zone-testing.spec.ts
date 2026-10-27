import { fakeAsync, flushMicrotasks, tick } from "@angular/core/testing";

describe("Zone.js test setup", () => {
	it("supports Angular async test helpers", fakeAsync(() => {
		let microtaskCompleted = false;
		let timerCompleted = false;

		Promise.resolve().then(() => {
			microtaskCompleted = true;
		});
		setTimeout(() => {
			timerCompleted = true;
		}, 10);

		expect(microtaskCompleted).toBeFalse();
		expect(timerCompleted).toBeFalse();
		flushMicrotasks();
		expect(microtaskCompleted).toBeTrue();
		expect(timerCompleted).toBeFalse();
		tick(10);
		expect(timerCompleted).toBeTrue();
	}));
});
