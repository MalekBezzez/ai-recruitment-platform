import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

function NotificationCard(props) {
  const { item, className, onClose, onMarkAsRead } = props;

  const handleClose = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    onClose?.(item.id);
  };

  return (
    <Card
      className={clsx(
        'flex items-center relative w-full rounded-16 p-20 min-h-64 shadow space-x-8 bg-white',
        className
      )}
      elevation={0}
      component={item.useRouter ? NavLinkAdapter : 'div'}
      to={item.link || ''}
      role={item.link && 'button'}
    >
      {/* Main content */}
      <div className="flex flex-col flex-auto">
        <Typography className="font-semibold text-black line-clamp-4 break-words">
  {item.title || 'Untitled notification'}
</Typography>

        {item.description && (
          <div
            className="line-clamp-2 text-gray-600"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        )}

        {item.time && (
          <Typography className="mt-8 text-sm leading-none text-gray-500">
            {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
          </Typography>
        )}

        {!item.read && (
          <Typography
            sx={{
              fontSize: 12,
              color: 'primary.main',
              textDecoration: 'underline',
              cursor: 'pointer',
              mt: 1,
              width: 'fit-content',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead?.(item.id);
            }}
          >
            Mark as read
          </Typography>
        )}
      </div>

      {/* Close (X) icon */}
      <IconButton
        disableRipple
        className="top-0 right-0 absolute p-8"
        color="default"
        size="small"
        onClick={handleClose}
      >
        <FuseSvgIcon size={12} className="opacity-75 text-gray-400">
          heroicons-solid:x
        </FuseSvgIcon>
      </IconButton>

      {item.children}
    </Card>
  );
}

export default NotificationCard;