interface ValueObjectProps {
  [index: string]: any;
}

export abstract class ValueObject<T extends ValueObjectProps> {
  public props: T;

  constructor(props: T) {
    let baseProps: any = {
      ...props,
    };

    this.props = baseProps;
  }

  public toValue(): T {
    return this.props;
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (!vo || !vo.props) {
      return false;
    }

    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
