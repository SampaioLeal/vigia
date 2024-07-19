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
	#permissions = new Map<
		`${/* action */ string}:${/* subject */ string}`,
		boolean
	>();
	#rawPermissions: RawRole<Action, Subject>[] = [];

	constructor(permissions?: RawRole<Action, Subject>[]) {
		permissions && this.buildPermissions(permissions);
	}

	buildPermissions(permissions: RawRole<Action, Subject>[]): void {
		this.#rawPermissions = permissions;
		this.#permissions.clear();
		permissions.forEach(([canOrCannot, action, subject]) => {
			this.set(canOrCannot, action, subject);
		});
	}

	set<Xaction extends string, Xsubject extends string>(
		canOrCannot: "can" | "cannot",
		action: Action | Xaction,
		subject: Subject | Xsubject,
	): Role<Action | Xaction, Subject | Xsubject> {
		this.#permissions.set(`${action}:${subject}`, canOrCannot === "can");

		return this;
	}

	can(action: Action, subject: Subject): boolean {
		return this.#permissions.get(`${action}:${subject}`) ?? false;
	}

	cannot(action: Action, subject: Subject): boolean {
		return !this.#permissions.get(`${action}:${subject}`);
	}

	extends<Xaction extends string, Xsubject extends string>(
		...roles: Role<Xaction, Xsubject>[]
	): Role<Xaction | Action, Xsubject | Subject> {
		roles.forEach((role) => {
			role.getRaw().forEach(([canOrCannot, action, subject]) => {
				this.set(canOrCannot, action, subject);
			});
		});
		return this;
	}

	clone(): Role<Action, Subject> {
		return new Role(this.getRaw());
	}
	extend<Xaction extends string, Xsubject extends string>(
		permissions: RawRole<Xaction | Action, Xsubject | Subject>[],
	): Role<Xaction | Action, Xsubject | Subject> {
		return permissions.reduce<Role<Xaction | Action, Xsubject | Subject>>(
			(role, [canOrCannot, action, subject]) =>
				role.set(canOrCannot, action, subject),
			this.clone(),
		);
	}

	getRaw(): RawRole<Action, Subject>[] {
		return structuredClone(this.#rawPermissions);
	}
}
