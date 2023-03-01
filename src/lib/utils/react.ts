import React from 'react';

export function findByType<T extends React.ElementType>(children: React.ReactNode, type: T) {
  return React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === type
  ) as React.ReactElement<T>[];
}
