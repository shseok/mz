import styled from 'styled-components';
import { colors } from '~/lib/colors';
import FooterTabItem from '~/components/base/FooterTabItem';
import { media } from '~/lib/media';

const Footer = () => {
  return (
    <StyledFooter>
      <FooterTabItem icon={'home'} to='/' />
      <FooterTabItem icon={'search'} to='/search' />
      <FooterTabItem icon={'plus-circle'} to='/write' />
      <FooterTabItem icon={'bookmark'} to='/bookmarks' />
      <FooterTabItem icon={'setting'} to='/setting' />
    </StyledFooter>
  );
};

const StyledFooter = styled.footer`
  min-height: 56px;
  border-top: 1px solid ${colors.gray0};
  display: flex;

  ${media.mobile} {
    display: none;
  }
`;

export default Footer;
