import { Injectable } from '@nestjs/common';
import { OrderStage, ORDER_STAGE_LABELS, ORDER_STAGE_SEQUENCE } from '../common/enums/order-stage.enum';

export type StageInfo = {
  value: OrderStage;
  label: string;
  order: number;
};

@Injectable()
export class StagesService {
  getAll(): StageInfo[] {
    return ORDER_STAGE_SEQUENCE.map((stage, index) => ({
      value: stage,
      label: ORDER_STAGE_LABELS[stage],
      order: index,
    }));
  }

  getLabel(stage: OrderStage): string {
    return ORDER_STAGE_LABELS[stage];
  }

  getIndex(stage: OrderStage): number {
    return ORDER_STAGE_SEQUENCE.indexOf(stage);
  }

  getNext(stage: OrderStage): OrderStage | null {
    const index = this.getIndex(stage);
    return index >= 0 && index < ORDER_STAGE_SEQUENCE.length - 1 ? ORDER_STAGE_SEQUENCE[index + 1] : null;
  }

  isLast(stage: OrderStage): boolean {
    return this.getIndex(stage) === ORDER_STAGE_SEQUENCE.length - 1;
  }
}
