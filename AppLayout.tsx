import * as React from 'react';
import { Layout } from 'antd';
import './AppLayout.less';
import { Switch, Redirect } from 'react-router-dom';
import Header from 'src/components/Header';
import SiderMenu from 'src/components/SiderMenu';
import Footer from 'src/components/Footer';
import DocumentTitle from 'react-document-title';
import ProtectedRoute from 'src/components/Router/ProtectedRoute';
import utils from 'src/utils/utils';
import { appRouters } from '../Router/router.config';

const { Content } = Layout;

class AppLayout extends React.Component<any> {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  onCollapse = (collapsed: any) => {
    this.setState({ collapsed });
  };

  render() {
    const {
      history,
      location: { pathname },
    } = this.props;

    const { path } = this.props.match;
    const { collapsed } = this.state;

    const layout = (
      <Layout>
        <SiderMenu path={path} 
                   onCollapse={this.onCollapse} 
                   history={history} 
                   collapsed={collapsed} />
        <Layout>
          <Layout.Header>
            <Header collapsed={this.state.collapsed} toggle={this.toggle} />
          </Layout.Header>
          <Content>
            <Switch>
              {appRouters
                .filter((item: any) => !item.isLayout)
                .map((route: any, index: any) => (
                  <ProtectedRoute key={index} 
                                  path={route.path} 
                                  component={route.component} 
                                  permission={route.permission} />
                ))}
              <Redirect from="/" to="/dashboard" />
            </Switch>
          </Content>
          <Layout.Footer>
            <Footer />
          </Layout.Footer>
        </Layout>
      </Layout>
    );
    return <DocumentTitle title={utils.getPageTitle(pathname)}>{layout}</DocumentTitle>;
  }
}

export default AppLayout;
