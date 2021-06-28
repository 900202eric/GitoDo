import React from 'react';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import Header from '../../components/header';
import Footer from '../../components/footer';
import MainSearchDisplay from '../../components/mainSearchView';
import { connect } from 'react-redux';
import Router from 'next/router';
import { searchBranches } from '../../api/line';
import { withRouter } from 'next/router';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      allLine: [],
    };

    this.handleDraw = this.handleDraw.bind(this);
    this.checkLogin = this.checkLogin.bind(this);
  }

  componentDidMount() {
    this.checkLogin();
    searchBranches(this.props.router.query.searchText.trim(), 0, 1000).then(
      (lines) => {
        this.setState({ allLine: lines });
      }
    );
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.router.query.searchText != prevProps.router.query.searchText
    ) {
      searchBranches(this.props.router.query.searchText.trim(), 0, 1000).then(
        (lines) => {
          this.setState({ allLine: lines });
        }
      );
    }
  }

  render() {
    console.log(this.state.allLine);
    return (
      <div className={styles.container}>
        <Head>
          <title>Search</title>
          <meta name='description' content='Generated by create next app' />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <Header></Header>

        <main className={styles.main + ' bg-gray-100 relative'}>
          <div className='sm:top-28 top-24 px-10 absolute w-auto container'>
            <div className='container flex flex-row mx-auto items-center'>
              <h1 className='text-2xl font-semibold'>
                {this.state.allLine.length} branch results
              </h1>
            </div>
            <hr className='my-2'></hr>
          </div>
          {this.state.allLine && (
            <MainSearchDisplay
              userId={this.props.userId}
              onDraw={this.handleDraw}
              mainLine={this.props.mainLine}
              allLine={this.state.allLine}
            ></MainSearchDisplay>)}
        </main>
              
        <Footer></Footer>
      </div>
    );
  }

  checkLogin() {
    if (this.props.userId == -1) {
      Router.push(
        {
          pathname: '/login',
          query: {},
        },
        `/login`
      );
    }
  }

  handleDraw() {
    return 0;
  }
}

const mapStateToProps = (state) => ({
  userId: state.login.userId,
  mainLine: state.branch.mainLine,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));