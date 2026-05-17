import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { useBreadcrumbsStack } from './BreadcrumbsProvider';

export default function BreadcrumbsTrail() {
  let ctx = null;
  try {
    ctx = useBreadcrumbsStack();
  } catch {
    // si jamais le hook pose souci, on garde un fallback silencieux
  }

  const stack = (ctx && Array.isArray(ctx.stack) ? ctx.stack : [{ label: 'Home', to: '/' }]);

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator="›"
      maxItems={8}
      sx={{ '& .MuiLink-root': { px: 1, py: 0.25, borderRadius: 1, bgcolor: 'action.hover', textDecoration: 'none' } }}
    >
      {stack.map((c, i) => {
        const isLast = i === stack.length - 1;
        const key = `${c.to}-${i}`;
        return (
          <Link
            key={key}
            component={isLast ? 'span' : RouterLink}
            to={isLast ? undefined : c.to}
            underline="hover"
            color={isLast ? 'text.primary' : 'inherit'}
          >
            {c.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
