// Shared colour code for all neuron models (same meaning on every page).
// Matching CSS tokens for legends live in assets/css/site.css (--c-*).
//   V      membrane potential, f-I curve, phase trajectory   blue
//   NEG    negative feedback: recovery / adaptation (u, w),   red
//          its nullcline and the spike-triggered jump (u+d, w+b)
//   POS    positive feedback (e.g. self-excitation)           green
//   IN     input current: curves set by I (V-nullcline, which  orange
//          shifts with I), rheobase current on the f-I curve
//   THRESH voltage thresholds: V_theta, V_T                   yellow
//   RESET  reset value: c, V_r                                purple
//   REST   rest: V_rest, E_L                                  grey
//   OP     where the neuron is now: state dot in the phase    yellow
//          plane, operating point on the f-I curve
const COL = {
  V:      '#009ADE',
  NEG:    '#FF1F5B',
  POS:    '#00CD6C',
  IN:     '#F28522',
  THRESH: '#FFC61E',
  RESET:  '#AF58BA',
  REST:   '#888888',
  OP:     '#FFC61E',
  TRAJ:   '0,154,222'     // = V blue as an rgb triplet, used with a varying alpha
};
