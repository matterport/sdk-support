import { MpSdk, Scene } from "./public/assets/sdk";

/**
 * The base of all `SceneComponent` created with the sdk.
 * All properties of this class are always available to all components generated through the sdk.
 * These properties should all be considered reserved and should not be overwritten by the subclass.
 */
abstract class SceneComponentPrivate {
  /**
   * @reserved
   * The name registered to the factory used to generate this component.
   */
  declare readonly componentType: string;

  /**
   * @reserved
   * A dictionary of properties that this component computes. Every component is guaranteed to have `outputs.collider` and `outputs.objectRoot`.
   * This dictionary is observable and can be the source of a bind target.
   *
   */
  declare outputs: Record<string, unknown> & Scene.PredefinedOutputs;

  /**
   * @reserved
   * The context provides access to the underlying framework, e.g. THREE.js.
   */
  declare context: Scene.IComponentContext;

  /**
   * @reserved
   * Binds `this[prop]` to the output of `src[srcProp]`.
   * When the value of `src[srcProp]` changes, the value is propagated and sets `this[prop]` to the same value automatically.
   */
  declare bind: (prop: string, src: Scene.IComponent, srcProp: string) => void;

  /**
   * @reserved
   * Notifies this component of an `eventType` when the `src` Component calls `notify` with a `srcEventType` event
   */
  declare bindEvent: (eventType: string, src: SceneComponent, srcEventType: string) => void;

  /**
   * @reserved
   * Notifies any event bindings of an event with `eventType` and data `eventData`
   */
  declare notify: (eventType: string, eventData?: unknown) => void;

  /**
   * @reserved
   * Spy on a component's notify from outside of the component system
   */
  declare spyOnEvent: (spy: Scene.IComponentEventSpy) => MpSdk.ISubscription;
}

export abstract class SceneComponent extends SceneComponentPrivate implements Scene.IComponent {
  /**
   * An optional dictionary of properties that affects the behavior of the component.
   * The properties can be changed by an external source at any time. It is up to the component to respond appropriately to the changes.
   * The input properties can also be bind targets to another observable source, e.g. the output property of another component.
   */
  inputs?: Record<string, unknown>;

  /**
   * @reserved
   * A dictionary of events that will be handled by this component's `onEvent`. Every component is guaranteed to have all of the `InteractionSelection` keys:
   *  `events[InteractionSelection.CLICK]`, `events[InteractionSelection.HOVER]`, `events[InteractionSelection.DRAG]`
   * Note: registering to receive `InteractionSelection.HOVER` will produce both `InteractionType.HOVER` and `InteractionType.UNHOVER` in `onEvent`.
   */
  declare events: Record<string, boolean>;

  /**
   * @reserved
   * A dictionary of events that will be emitted by this component.
   */
  declare emits?: Record<string, boolean>;

  /**
   * This event is called once after the scene node its attached to has started.
   */
  onInit?(): void;

  /**
   * This event is called at most once per frame when there are events on this component.
   * Any of the interaction types specified in `this.interactions` or a call to notify for a bound event will trigger this event.
   * @property {string | ComponentInteractionType} eventType The event type
   * @property {unknown} eventData The data payload of the event
   */
  onEvent?(eventType: string, eventData: unknown): void;

  /**
   * This event is called after an input property has changed.
   * It will be called at most once a frame.
   */
  onInputsUpdated?(previousInputs: this["inputs"]): void;

  /**
   * This event is called once a frame after input changes have been detected.
   */
  onTick?(tickDelta: number): void;

  /**
   * This event is called once right before the scene node has stopped.
   */
  onDestroy?(): void;
}

/*
 * below are enums that need to be re-created since the declaration file doesn't generate js
 * TODO: export from mp_webgl in a more consumable way
 *
 */

export enum PointerButton {
  PRIMARY = 0,
  MIDDLE = 1,
  SECONDARY = 2,
  BACK = 3,
  FORWARD = 4,
  COUNT = 5,
}

export enum PointerButtonMask {
  NONE,
  PRIMARY = 1 << PointerButton.PRIMARY,
  SECONDARY = 1 << PointerButton.SECONDARY,
  MIDDLE = 1 << PointerButton.MIDDLE,
  BACK = 1 << PointerButton.BACK,
  FORWARD = 1 << PointerButton.FORWARD,
  ALL = (1 << PointerButton.COUNT) - 1,
}

export enum PointerDevice {
  MOUSE = "mouse",
  TOUCH = "touch",
  PEN = "pen",
  GAMEPAD = "gamepad",
}

export enum KeyState {
  DOWN,
  PRESSED,
  UP,
}

export enum Keys {
  ESCAPE = 27,
  ZERO = 48,
  ONE = 49,
  TWO = 50,
  THREE = 51,
  FOUR = 52,
  FIVE = 53,
  SIX = 54,
  SEVEN = 55,
  EIGHT = 56,
  NINE = 57,
  LEFTARROW = 37,
  UPARROW = 38,
  RIGHTARROW = 39,
  DOWNARROW = 40,
  TAB = 9,
  A = 65,
  B = 66,
  C = 67,
  D = 68,
  E = 69,
  F = 70,
  G = 71,
  H = 72,
  I = 73,
  J = 74,
  K = 75,
  L = 76,
  M = 77,
  N = 78,
  O = 79,
  P = 80,
  Q = 81,
  R = 82,
  S = 83,
  T = 84,
  U = 85,
  V = 86,
  W = 87,
  X = 88,
  Y = 89,
  Z = 90,
  SPACE = 32,
  RETURN = 13,
  DELETE = 46,
  BACKSPACE = 8,
  SEMICOLON = 186,
  PLUSEQUALS = 187,
  DASHUNDERSCORE = 189,
  OPENBRACKET = 219,
  SHIFT = 16,
  ALT = 18,
  CONTROL = 17,
}

/**
 * The types of the Interaction events received from the registered `InteractionSelection`
 */
export enum InteractionType {
  CLICK = "INTERACTION.CLICK",
  HOVER = "INTERACTION.HOVER",
  DRAG = "INTERACTION.DRAG",
  DRAG_BEGIN = "INTERACTION.DRAG_BEGIN",
  DRAG_END = "INTERACTION.DRAG_END",
  POINTER_MOVE = "INTERACTION.POINTER_MOVE",
  POINTER_BUTTON = "INTERACTION.POINTER_BUTTON",
  SCROLL = "INTERACTION.SCROLL",
  KEY = "INTERACTION.KEY",
  LONG_PRESS_START = "INTERACTION.LONG_PRESS_START",
  LONG_PRESS_END = "INTERACTION.LONG_PRESS_END",
  MULTI_SWIPE = "INTERACTION.MULTI_SWIPE",
  MULTI_SWIPE_END = "INTERACTION.MULTI_SWIPE_END",
  PINCH = "INTERACTION.PINCH",
  PINCH_END = "INTERACTION.PINCH_END",
  ROTATE = "INTERACTION.ROTATE",
  ROTATE_END = "INTERACTION.ROTATE_END",
}
