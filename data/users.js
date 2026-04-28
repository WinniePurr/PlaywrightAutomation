// user credentials + login error messages

export const users = {

    standardUser: { username: 'standard_user', password: 'secret_sauce' },
    lockedOutUser: { username: 'locked_out_user', password: 'secret_sauce' },
    problemUser: { username: 'problem_user', password: 'secret_sauce'},
    performanceUser: { username: 'performance_glitch_user', password: 'secret_sauce'},
    errorUser: { username: 'error_user', password: 'secret_sauce'},
    visualUser: { username: 'visual_user', password: 'secret_sauce' },
    nonExistentUser: { username: 'non_existent_user', password: 'secret_sauce' },
    invalidPassword: { username: 'standard_user', password: 'wrong_password' },
    emptyUsername: { username: '', password: 'secret_sauce' },
    emptyPassword: { username: 'standard_user', password: '' },
    emptyCredentials: { username: '', password: '' }   

}

export const errorMessages = {
    
    invalidCredentialsError: 'Epic sadface: Username and password do not match any user in this service',
    lockedOutError: 'Epic sadface: Sorry, this user has been locked out.',
    emptyUsernameError: 'Epic sadface: Username is required',
    emptyPasswordError: 'Epic sadface: Password is required',
    directURLAccessError: 'Epic sadface: You can only access \'/inventory.html\' when you are logged in.'
}