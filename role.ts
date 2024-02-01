export type RawRole<Action extends string, Subject extends string> = [
  "can" | "cannot",
  Action,
  Subject,
];

export type Permissions<Action extends string, Subject extends string> = {
  can: {
    [action in Action]: {
      [subject in Subject]: boolean;
    };
  };
  cannot: {
    [action in Action]: {
      [subject in Subject]: boolean;
    };
  };
};

export class Role<Action extends string, Subject extends string> {
  #permissions = new Map<`${Action}:${Subject}`, boolean>();
  #rawPermissions: RawRole<Action, Subject>[] = [];

  constructor(permissions?: RawRole<Action, Subject>[]) {
    permissions && this.buildPermissions(permissions);
  }

  buildPermissions(permissions: RawRole<Action, Subject>[]) {
    this.#rawPermissions = permissions;
    this.#permissions.clear();
    permissions.forEach(([canOrCannot, action, subject]) => {
      this.set(canOrCannot, action, subject);
    });
  }

  set(canOrCannot: "can" | "cannot", action: Action, subject: Subject) {
    this.#permissions.set(`${action}:${subject}`, canOrCannot === "can");

    return this;
  }

  can(action: Action, subject: Subject) {
    return this.#permissions.get(`${action}:${subject}`) ?? false;
  }

  cannot(action: Action, subject: Subject) {
    return !this.#permissions.get(`${action}:${subject}`);
  }

  getRaw() {
    return structuredClone(this.#rawPermissions);
  }
}
