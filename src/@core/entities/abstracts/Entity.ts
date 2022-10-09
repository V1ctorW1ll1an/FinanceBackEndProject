import crypto from 'crypto';

const isEntity = (obj: any): obj is Entity<any> => {
  return obj instanceof Entity;
};

interface Properties {
  id?: string;
}

export abstract class Entity<T extends Properties> {
  private _dirtyProperties: string[];
  protected _id: string;
  protected props: T;
  public readonly isNew: boolean;

  constructor(props: T, isNew = true) {
    const handler = () => {
      const setPropertyDirty = (prop: string) => {
        if (!this.isNew) {
          this._dirtyProperties.push(prop);
        }
      };

      return {
        set: function (obj: any, prop: string, value: any) {
          obj[prop] = value;
          setPropertyDirty(prop);
          return true;
        },
      };
    };

    if (!props.id && !isNew) {
      throw new Error('Dirty Entities must has an ID');
    }

    this._id = props.id ? props.id : crypto.randomUUID();
    this.isNew = isNew;
    this._dirtyProperties = [];
    this.props = new Proxy(props, handler());
  }

  public get id(): string {
    return this._id;
  }

  protected set id(value: string) {
    this._id = value;
  }

  public getDirtyProps(): string[] {
    return this._dirtyProperties;
  }

  public equals(entity?: Entity<T>): boolean {
    if (!entity || !isEntity(entity)) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    return this._id === entity._id;
  }
}
