# Vigia

Handle authorization in your javascript applications like a boss

## Examples

```ts
const userRole = new Role();

userRole.buildPermissions([
  ["can", "make", "coffee"],
  ["cannot", "make", "sandwich"],
]);

userRole.can("make", "coffee"); // true
userRole.cannot("make", "coffee"); // false

if (userRole.can("make", "coffee")) {
  // work more...
} else {
  // work to buy more coffee
}
```

You can choose the builder pattern to set the role permissions.

```ts
const userRole = new Role();

userRole.set("can", "make", "coffee").set("cannot", "make", "sandwich");

userRole.can("make", "coffee"); // true
userRole.cannot("make", "coffee"); // false

if (userRole.can("make", "coffee")) {
  // work more...
} else {
  // work to buy more coffee
}
```

You can also save and/or fetch your roles by using the `getRaw()` method that returns an array of abilities.

```ts
const userRole = new Role();

userRole.buildPermissions([
  ["can", "make", "coffee"],
  ["cannot", "make", "sandwich"],
]);

userRole.getRaw(); // [ ["can", "make", "coffee"], ["cannot", "make", "sandwich"] ]
```
