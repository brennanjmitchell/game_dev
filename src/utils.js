import * as THREE from 'three';

/**
 * Moves a matrix by a specified amount in X, Y, and Z.
 * @param {THREE.Matrix4} matrix - The matrix to move.
 * @param {number} deltaX - The amount to move in the X direction.
 * @param {number} deltaY - The amount to move in the Y direction.
 * @param {number} deltaZ - The amount to move in the Z direction.
 */
export function moveMatrix(matrix, deltaX = 0, deltaY = 0, deltaZ = 0) {
  const translationMatrix = new THREE.Matrix4();
  translationMatrix.makeTranslation(deltaX, deltaY, deltaZ);
  matrix.multiply(translationMatrix);
}

/**
 * Prints a THREE.Matrix4 to the console in a readable format.
 * @param {THREE.Matrix4} matrix - The matrix to print.
 */
export function printMatrix(matrix) {
  const matrixArray = matrix.toArray();
  console.log('Matrix as array:', matrixArray);
  console.table([
    matrixArray.slice(0, 4),
    matrixArray.slice(4, 8),
    matrixArray.slice(8, 12),
    matrixArray.slice(12, 16),
  ]);
}
