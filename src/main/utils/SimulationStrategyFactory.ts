import { Pytt2Strategy } from "./pytt2Strategy";
import { Pytt2V132Strategy } from "./pytt2V132Strategy";
import { SimulationStrategyBase, SimulatorStrategyType } from "./SimulationStrategyBase";

export const createSimulationStrategy = (
  strategy: SimulatorStrategyType
): SimulationStrategyBase => {
  switch (strategy) {
    case SimulatorStrategyType.Pytt2:
      return new Pytt2Strategy();
    case SimulatorStrategyType.Pytt2V132:
      return new Pytt2V132Strategy();
    default:
      return new Pytt2V132Strategy();
  }
};
