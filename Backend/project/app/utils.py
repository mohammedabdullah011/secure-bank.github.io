def is_allowed_to_attempt_login(request, credentials):
    # Custom logic to determine if the user is allowed to attempt login
    # For example, you might want to check if the user's IP address is not blocked
    # or if the user is not in a specific group that should be exempt from lockouts.
    
    # Example logic:
    user_ip = request.META.get('REMOTE_ADDR')
    # Check if the user's IP address is not in a list of blocked IPs
    if user_ip not in ['blocked_ip1', 'blocked_ip2']:
        return True
    else:
        return False