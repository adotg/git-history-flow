#!/bin/bash

TARGET_FILE="$1"
# Saves function output
FN_OP= 

maker() {
    local new_obj=
    local i=
    local list=
    
    new_obj="{ "
    list=$1[@]
    list=("${!list}")

    for (( i = 0; i < ${#list[*]}; i+=2 ))
    do
        new_obj+=\"${list[i]}\"
        new_obj+=": "
        new_obj+=${list[i+1]}
        
        new_obj+=","
    done
    
    new_obj=`echo "$new_obj" | sed 's/.$//'`
    new_obj+=" }"
    echo $new_obj
}

insert_at_last() {
    local open_obj=

    open_obj=`echo "$1" | sed 's/.$//'`
    open_obj+=", "
    open_obj+=\"$2\"
    open_obj+=": "
    open_obj+=$3
    open_obj+=" }"
    
    echo $open_obj
}

normalize_change() {
    local op=
    if [[ $1 == *","* ]]; then
        op=$1
    else
        op="$1,1"
    fi
    
    echo $op
}

extract_changes() {
    local res=
    local deletion=
    local addition=
    local op="["

    # Extract the text between @@ and @@
    res=`echo "$1" | sed -e 's/@@ \(.*\) @@\(.*\)/\1/'`
    deletion=`echo "$res" | sed -e 's/\-\(.*\) \(.*\)/\1/'`
    addition=`echo "$res" | sed -e 's/\(.*\)\+\(.*\)$/\2/'`
    
    op+=`normalize_change $deletion`
    op+=","
    op+=`normalize_change $addition`
    op+="]"
    
    echo $op 
}

process() {
    local i=
    local line_list=
    local line=
    local op=
    local op_obj="["
    local user=
    local list_len=
    local args=

    IFS=$'\n' read -rd '' -a line_list <<<"$1"
    list_len=${#line_list[*]}

    for (( i = 0; i < list_len; ++ i ))
    do
        line=${line_list[$i]}
        if [[ $line =~ ^@@+ ]]; then
            op_obj+=`extract_changes "$line"`
            op_obj+=","
            if [ "$2" = true ] ; then
                break
            fi
        fi
    done
    
    op_obj=`echo "$op_obj" | sed 's/.$//'`
    op_obj+="]"
   
    args=("changes" "$op_obj")
    op=`maker args`
   
    FN_OP=$op
}

loggable() {
    local res=
    # Apply git log on any commit and sends it for processing with a flag which says to stop execution whenever the
    # match is found
    res=`git log -U0 $1 $TARGET_FILE`
    process "$res" $true
}

diffable() {
    local res=
    # Apply git log on any commit and sends it for processing until the end of the string is encountered
    res=`git diff -U0 $1 $2 $TARGET_FILE`
    process "$res" $false
}

# Split the string sepatated by new line character in list
DIFF_COMMITS=`git log --pretty="{ \"commitId\": \"%h\", \"desc\": \"%s\", \"timestamp\": \"%ci\", \"user\": { \"name\": \"%cn\", \"email\": \"%ce\" } }" --reverse wercker.yml`
IFS=$'\n' read -rd '' -a COMMITS_LIST <<<"$DIFF_COMMITS" 

for (( i = 0; i < ${#COMMITS_LIST[*]}; ++ i ))
do
    item=${COMMITS_LIST[$i]}
    COMMIT_ID=`echo "$item" | sed -e 's/^{[[:blank:]]\"commitId\":[[:blank:]]\"\(.*\)\",[[:blank:]]\"desc\":.*/\1/'`
    
    if ((i==0))
    then
        # For the first commit, apply git log as there is nothing against which it would be diffed to
        loggable $COMMIT_ID
    else
        # For for subsequent commits, apply git diff between the previous and current commit 
        diffable $PREV_COMMIT_ID $COMMIT_ID
    fi
    
    OP=`insert_at_last "$item" "diff" "$FN_OP"`
    PREV_COMMIT_ID=$COMMIT_ID
    echo "$OP"
done
