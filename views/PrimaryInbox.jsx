const React = require('react')
import CheckBoxOutlineBlankRoundedIcon from '@material-ui/icons/CheckBoxOutlineBlankRounded';
import StarBorderIcon from '@material-ui/icons/StarBorder';

export default class PrimaryInbox extends React.Component {
    render () {
        let mailid = "/" + this.props.mailid
        return (
                <div>
                    <a className="email" href={mailid}>
                        <CheckBoxOutlineBlankRoundedIcon className="email-icons"/>
                        <StarBorderIcon className="email-icons"/>
                        <div className="sender-line">{this.props.sender}</div>
                        <div className="subject-line"><span className="subject-bold">{this.props.subject}</span><span className="snippet-line">{this.props.snippet}</span></div>
                        <div className="date-line">{this.props.date}</div>
                    </a>
                </div>
            )
    }
}