// Shared colour code for all neuron models (same meaning on every page).
// Matching CSS tokens for legends live in assets/css/site.css (--c-*).
//   V      membrane potential, its nullcline, f-I curve      blue
//   NEG    negative feedback: recovery / adaptation (u, w),   red
//          its nullcline and the spike-triggered jump (u+d, w+b)
//   POS    positive feedback (e.g. self-excitation)           green
//   THRESH thresholds: V_theta, V_T, rheobase                 yellow
//   RESET  reset value: c, V_r                                purple
//   REST   rest: V_rest, E_L                                  grey
//   STATE  phase trajectory, current state dot               white
//   OP     operating point on the f-I curve                   yellow
const COL = {
  V:      '#009ADE',
  NEG:    '#FF1F5B',
  POS:    '#00CD6C',
  THRESH: '#FFC61E',
  RESET:  '#AF58BA',
  REST:   '#888888',
  STATE:  '#E8E8E8',
  OP:     '#FFC61E',
  TRAJ:   '220,220,220'   // rgb triplet, used with a varying alpha
};
