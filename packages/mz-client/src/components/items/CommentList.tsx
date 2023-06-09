import React from 'react';
import styled from 'styled-components';
import CommentInput from './CommentInput';
import { Comment } from '~/lib/api/types';
import CommentItem from './CommentItem';

interface Props {
  comments: Comment[];
}

const CommentList = ({ comments }: Props) => {
  return (
    <Block>
      <CommentTitle>댓글 {comments.length}개</CommentTitle>
      <CommentInput />
      <List>
        {comments.map((comment) => (
          <CommentItem comment={comment} key={comment.id} />
        ))}
      </List>
    </Block>
  );
};

const Block = styled.div`
  padding: 16px;
`;

const CommentTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
`;

const List = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;
export default CommentList;
