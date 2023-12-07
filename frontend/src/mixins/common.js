export default {
    methods: {
        checkIfInRole: (user, roleNums) => {
            let intersection = []
            if(roleNums == null) {
                intersection.push(-1)
            } else {
                roleNums.forEach((roleNum) => {
                    if(user.roles && user.roles.includes(roleNum)) {
                        intersection.push(roleNum)
                    }
                })
            }
            return intersection.length > 0
        }
    }
}